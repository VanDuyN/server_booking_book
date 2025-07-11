import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load all language files
const loadLanguages = () => {
    const languages = {};
    const localesDir = path.join(__dirname, '../locales');
    const files = fs.readdirSync(localesDir);
    files.forEach(file => {
        if (file.endsWith('.json')) {
            const lang = file.replace('.json', '');
            const filePath = path.join(localesDir, file);
            languages[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    });
    
    return languages;
};

const languages = loadLanguages();

// Get translation
export const t = (key, lang ) => {
    const keys = key.split('.');
    let value = languages[lang];
    for (const k of keys) {
        if (value && typeof value === 'object') {
            value = value[k];
        } else {
            return key; // Return key if translation not found
        }
    }
    
    return value || key;
};

// Get user language from request
export const getLanguage = (req) => {
    const headerLang = req.headers['accept-language'];
    const detectedLang = req.query.lang || 
           headerLang?.split(',')[0]?.split('-')[0] || 
           req.cookies?.language || 
           'vi';
    return detectedLang;
};

// Middleware to add translation function to req
export const i18nMiddleware = (req, res, next) => {
    const userLang = getLanguage(req);
    req.t = (key) => t(key, userLang);
    req.lang = userLang;
    next();
};
export default { t, getLanguage, i18nMiddleware };