import { matchedData } from "express-validator";
import { User } from '../mongoose/schemas/user.mjs';
import { hashPassword } from '../utils/helpers.mjs';
import { t } from '../utils/i18n.mjs';
import { getLanguage } from '../utils/i18n.mjs';

export const userController = {
  // Lấy tất cả người dùng
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({}, '-password');
      return res.status(200).json({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Lấy thông tin người dùng theo ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id, '-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Cập nhật thông tin người dùng
  updateUser: async (req, res) => {
    const lang = getLanguage(req);
    const data = matchedData(req);
    
    try {
      // Nếu có password, hash nó
      if (data.password) {
        data.password = hashPassword(data.password);
      }
      
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true, runValidators: true, select: '-password' }
      );
      
      if (!updatedUser) {
        return res.status(404).json({ error: t('user.not_found', lang) });
      }
      
      return res.status(200).json({
        message: t('user.update_success', lang),
        user: updatedUser
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(400).json({ error: error.message });
    }
  },

  // Xóa người dùng
  deleteUser: async (req, res) => {
    const lang = getLanguage(req);
    
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ error: t('user.not_found', lang) });
      }
      
      return res.status(200).json({
        message: t('user.delete_success', lang)
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: error.message });
    }
  }
};