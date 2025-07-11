import cluster from 'cluster';
import os from 'os';
import app from './server.mjs';
import connectDatabase from './config/database.mjs';

const PORT = process.env.PORT || 3000;
const numCPUs = os.cpus().length;

// Hàm khởi động server
const startServer = async () => {
  try {
    // Kết nối database trước khi khởi động server
    await connectDatabase();
    
    // Khởi động server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy trên cổng ${PORT} (tiến trình ${process.pid})`);
    });
    
    // Xử lý tắt server một cách nhẹ nhàng
    const gracefulShutdown = () => {
      console.log('Nhận tín hiệu tắt server...');
      server.close(() => {
        console.log('Đã đóng kết nối HTTP');
        process.exit(0);
      });
      
      // Nếu server không đóng trong 10 giây, buộc tắt
      setTimeout(() => {
        console.error('Không thể đóng kết nối, buộc tắt!');
        process.exit(1);
      }, 10000);
    };
    
    // Xử lý các tín hiệu tắt server
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    
    return server;
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error);
    process.exit(1);
  }
};

// Chỉ dùng cluster ở môi trường production
const isDev = process.env.NODE_ENV !== 'production';

if (cluster.isPrimary && !isDev) {
  console.log(`Máy chủ chính ${process.pid} đang chạy`);
  
  // Tạo các tiến trình con cho mỗi CPU
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // Nếu tiến trình con bị lỗi, tạo mới
  cluster.on('exit', (worker) => {
    console.log(`Tiến trình ${worker.process.pid} đã dừng - đang khởi động lại`);
    cluster.fork();
  });
} else {
  // Khởi động server
  startServer();
}