import jwt from 'jsonwebtoken';
import { User } from '../mongoose/schemas/user.mjs';
import { t } from '../utils/i18n.mjs';
import { getLanguage } from '../utils/i18n.mjs';

/**
 * Middleware xác thực JWT token
 * Kiểm tra và xác thực token từ header Authorization
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const lang = getLanguage(req);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ 
        error: t('auth.token_required', lang) || 'Token required' 
      });
    }
    
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Tìm user từ id trong token
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        error: t('auth.invalid_token', lang) || 'Invalid token' 
      });
    }
    
    // Gán thông tin user vào request để sử dụng ở middleware tiếp theo
    req.user = user;
    next();
  } catch (error) {
    // Xử lý các lỗi JWT khác nhau
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: t('auth.token_expired', lang) || 'Token expired' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: t('auth.invalid_token', lang) || 'Invalid token' 
      });
    }
    
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      error: t('common.server_error', lang) || 'Server error' 
    });
  }
};

/**
 * Middleware kiểm tra quyền admin
 * Chỉ cho phép admin truy cập
 */
export const requireAdmin = (req, res, next) => {
  const lang = getLanguage(req);
  
  // authenticateToken phải chạy trước middleware này
  if (!req.user) {
    return res.status(401).json({ 
      error: t('auth.unauthorized', lang) || 'Unauthorized' 
    });
  }
  
  // Kiểm tra role admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: t('auth.admin_required', lang) || 'Admin access required' 
    });
  }
  
  next();
};

/**
 * Middleware kiểm tra chủ sở hữu resource
 * Chỉ cho phép chủ sở hữu hoặc admin truy cập
 * @param {String} paramName - Tên tham số URL chứa ID resource (mặc định: 'id')
 * @param {String} resourceType - Loại tài nguyên (user, booking, etc.)
 */
export const requireOwnership = (resourceType = 'user', paramName = 'id') => {
  return async (req, res, next) => {
    const lang = getLanguage(req);
    
    // authenticateToken phải chạy trước middleware này
    if (!req.user) {
      return res.status(401).json({ 
        error: t('auth.unauthorized', lang) || 'Unauthorized' 
      });
    }
    
    // Admin luôn có quyền truy cập
    if (req.user.role === 'admin') {
      return next();
    }
    
    const resourceId = req.params[paramName];
    
    // Nếu là người dùng đang truy cập tài nguyên của chính họ
    if (resourceType === 'user' && req.user._id.toString() === resourceId) {
      return next();
    }
    
    // Các loại tài nguyên khác có thể cần truy vấn database
    if (resourceType !== 'user') {
      try {
        // Ví dụ với booking: kiểm tra userId trong booking
        const Resource = mongoose.model(resourceType.charAt(0).toUpperCase() + resourceType.slice(1));
        const resource = await Resource.findById(resourceId);
        
        if (!resource) {
          return res.status(404).json({ 
            error: t(`${resourceType}.not_found`, lang) || 'Resource not found' 
          });
        }
        
        if (resource.userId && resource.userId.toString() === req.user._id.toString()) {
          return next();
        }
      } catch (error) {
        console.error('Ownership check error:', error);
        return res.status(500).json({ 
          error: t('common.server_error', lang) || 'Server error' 
        });
      }
    }
    
    // Nếu không phải chủ sở hữu
    return res.status(403).json({ 
      error: t('auth.forbidden', lang) || 'Access forbidden' 
    });
  };
};

// Xuất JWT helper functions để sử dụng trong controllers
export const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};