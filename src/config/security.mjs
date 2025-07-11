import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Rate limiter để ngăn chặn brute force
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // 100 request mỗi IP trong 15 phút
  standardHeaders: true,
  message: 'Quá nhiều request, vui lòng thử lại sau'
});

// Cấu hình bảo mật cho Express
export const configSecurity = (app) => {
  // Bảo vệ các HTTP headers
  app.use(helmet());
  
  // Thêm middleware ngăn chặn NoSQL Injection đơn giản
  app.use((req, res, next) => {
    // Kiểm tra body có chứa các ký tự đáng ngờ
    if (req.body) {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string' && 
            (req.body[key].includes('$') || 
             req.body[key].includes('{') || 
             req.body[key].includes('}'))) {
          return res.status(400).json({ error: 'Invalid input data' });
        }
      }
    }
    next();
  });
  
  return app;
};