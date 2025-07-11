import { matchedData } from "express-validator";
import { User } from '../mongoose/schemas/user.mjs';
import { hashPassword } from '../utils/helpers.mjs';
import { loginUser } from "../strategies/jwt-auth.mjs";
import { t } from '../utils/i18n.mjs';
import { getLanguage } from '../utils/i18n.mjs';

export const authController = {
  // Đăng ký người dùng
  register: async (req, res) => {
    const lang = getLanguage(req);
    const data = matchedData(req);
    
    try {
      // Kiểm tra email đã tồn tại
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        return res.status(409).json({ error: t('auth.email_exists', lang) });
      }

      // Hash password
      data.password = hashPassword(data.password);
      
      const newUser = new User(data);
      const savedUser = await newUser.save();
      
      // Loại bỏ password trong response
      const { password, ...userResponse } = savedUser.toObject();

      return res.status(201).json({
        message: t('auth.register_success', lang),
        user: userResponse
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(400).json({ error: error.message });
    }
  },

  // Đăng nhập
  login: async (req, res) => {
    const lang = getLanguage(req);
    const data = matchedData(req);

    try {
      const { token, user } = await loginUser(data.email, data.password);
      res.status(200).json({ 
        message: t('auth.login_success', lang),
        token,
        user
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({ error: t('auth.invalid_credentials', lang) });
    }
  },

  // Kiểm tra trạng thái xác thực
  checkStatus: (req, res) => {
    // req.user đã được đặt bởi middleware authenticateToken
    return res.status(200).json({ user: req.user });
  }
};