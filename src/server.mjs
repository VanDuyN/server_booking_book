import dotenv from 'dotenv';
import configureExpress from './config/express.mjs';
import connectDatabase from './config/database.mjs';
import usersRouter from './routers/users.mjs';

// Load environment variables
dotenv.config();

// Khởi tạo Express app
const app = configureExpress();

// Đăng ký các routes
app.use(usersRouter);
// Thêm routers khác ở đây...

// Middleware xử lý route không tồn tại - luôn đặt sau tất cả routes
app.use((req, res) => {
  res.status(404).json({ error: 'Không tìm thấy đường dẫn này' });
});

// Middleware xử lý lỗi - luôn đặt cuối cùng
app.use((err, req, res, next) => {
  console.error(`Lỗi: ${err.message}`);
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Đã xảy ra lỗi trong server',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Đảm bảo không khởi động server trong file này
// Server sẽ được khởi động trong index.mjs sau khi kết nối database
export default app;