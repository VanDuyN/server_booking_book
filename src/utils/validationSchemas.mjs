import { t } from './i18n.mjs';

// Login schema
export const loginValidationSchema = (lang = 'vi') => ({
  email: {
    isEmail: {
      errorMessage: t('validation.email.invalid', lang),
    },
    notEmpty: {
      errorMessage: t('validation.email.required', lang),
    },
  },
  password: {
    notEmpty: {
      errorMessage: t('validation.password.required', lang),
    }
  }
});

// Create user schema
export const createUserValidationSchema = (lang = 'vi') => ({
  firstName: {
    notEmpty: {
      errorMessage: t('validation.firstName.required', lang),
    },
    isString: {
      errorMessage: t('validation.firstName.string', lang),
    }
  },
  lastName: {
    notEmpty: {
      errorMessage: t('validation.lastName.required', lang),
    },
    isString: {
      errorMessage: t('validation.lastName.string', lang),
    }
  },
  email: {
    isEmail: {
      errorMessage: t('validation.email.invalid', lang),
    },
    notEmpty: {
      errorMessage: t('validation.email.required', lang),
    },
  },
  password: {
    notEmpty: {
      errorMessage: t('validation.password.required', lang),
    },
    isLength: {
      options: { min: 6, max: 32 },
      errorMessage: t('validation.password.length', lang),
    },
  },
  phoneNumber: {
    optional: true,
    matches: {
      options: [/^\d{10,15}$/],
      errorMessage: t('validation.phone.invalid', lang),
    }
  }
});

// Update user schema (không yêu cầu password)
export const updateUserValidationSchema = (lang = 'vi') => ({
  firstName: {
    optional: true,
    isString: {
      errorMessage: t('validation.firstName.string', lang),
    }
  },
  lastName: {
    optional: true,
    isString: {
      errorMessage: t('validation.lastName.string', lang),
    }
  },
  email: {
    optional: true,
    isEmail: {
      errorMessage: t('validation.email.invalid', lang),
    }
  },
  password: {
    optional: true,
    isLength: {
      options: { min: 6, max: 32 },
      errorMessage: t('validation.password.length', lang),
    }
  },
  phoneNumber: {
    optional: true,
    matches: {
      options: [/^\d{10,15}$/],
      errorMessage: t('validation.phone.invalid', lang),
    }
  }
});