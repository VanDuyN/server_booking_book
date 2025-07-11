import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { i18nMiddleware } from '../utils/i18n.mjs';

/**
 * Cấu hình ứng dụng Express
 * @returns {Object} Ứng dụng Express đã cấu hình
 */
const configureExpress = () => {
  const app = express();
  
  // Middleware phân tích dữ liệu
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  
  // CORS - cho phép truy cập từ các domain khác
  app.use(cors({
    origin: [
      'https://bookingbookhkd.vercel.app', // Frontend production
      'http://localhost:3000',             // Frontend development  
      'http://localhost:5173'              // Vite dev server
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  // Nén dữ liệu để giảm kích thước response
  app.use(compression()); 
  
  // Tăng timeout cho requests
  app.use((req, res, next) => {
    req.setTimeout(30000); // 30 giây
    res.setTimeout(30000);
    next();
  });
  
  // Middleware đa ngôn ngữ
  app.use(i18nMiddleware);
  
  // Middleware ghi log thời gian xử lý request
  app.use((req, res, next) => {
    const start = Date.now();
    
    // Khi response hoàn tất
    res.on('finish', () => {
      const time = Date.now() - start;
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${time}ms`);
      
      // Cảnh báo nếu request quá chậm
      if (time > 1000) {
        console.warn(`Request chậm: ${req.originalUrl} (${time}ms)`);
      }
    });
    
    next();
  });
  
  return app;
};

export default configureExpress;