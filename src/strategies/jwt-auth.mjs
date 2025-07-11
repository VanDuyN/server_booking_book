import jwt from 'jsonwebtoken';
import { User } from '../mongoose/schemas/user.mjs';
import { hashPassword, comparePassword } from '../utils/helpers.mjs';
import { t } from '../utils/i18n.mjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Tạo JWT token
export const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id, 
            email: user.email,
            firstName: user.firstName 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Verify JWT token
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

// Login function
export const loginUser = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error('Email không tồn tại');
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Mật khẩu sai');
    }
    
    const token = generateToken(user);
    return { token };
};