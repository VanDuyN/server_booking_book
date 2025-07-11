import { checkSchema, validationResult } from "express-validator";
import { loginValidationSchema, createUserValidationSchema, updateUserValidationSchema } from '../utils/validationSchemas.mjs';
import { getLanguage } from '../utils/i18n.mjs';

// Lấy schema theo ngôn ngữ
const getSchemas = (lang) => {
  return {
    createUser: createUserValidationSchema(lang),
    login: loginValidationSchema(lang),
    updateUser: updateUserValidationSchema(lang)
  };
};

// Factory function tạo validator
export const createValidator = (schemaName) => {
  return (req, res, next) => {
    const lang = getLanguage(req);
    const schema = getSchemas(lang)[schemaName];
    
    if (!schema) {
      return res.status(500).json({
        error: `Validation schema '${schemaName}' not found`
      });
    }
    
    // Lấy tất cả validators
    const validators = checkSchema(schema);
    
    // Function chạy validators tuần tự
    const runValidators = (index = 0) => {
      if (index >= validators.length) {
        // Kiểm tra kết quả validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        return next();
      }
      
      validators[index](req, res, (err) => {
        if (err) return next(err);
        runValidators(index + 1);
      });
    };
    
    // Bắt đầu chạy
    runValidators();
  };
};