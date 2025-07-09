import e from "express";

export const loginValidationSchema = {
    email: {
        matches: {
            options: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/],
            errorMessage: 'Email không hợp lệ',
        },
    },
    password: {
        notEmpty:{
            errorMessage: 'Vui lòng nhập mật khẩu',
        },
        isLength: {
            options: { min: 6, max: 32 },
            errorMessage: 'Tên người dùng phải từ 5 đến 100 ký tự',
        },
    },
};
export const createUserValidationSchema = {
    firstName: {
        isString: {
            errorMessage: 'Tên phải là một chuỗi',
        },
        isLength: {
            options: { min: 1, max: 30 },
            errorMessage: 'Tên tối đa 30 ký tự',
        },
        notEmpty: {
            errorMessage: 'Vui lòng nhập tên',
        },
    },
    lastName: {
        isString: {
            errorMessage: 'Họ phải là một chuỗi',
        },
        notEmpty: {
            errorMessage: 'Vui lòng nhập họ',
        },
        isLength: {
            options: { min: 1, max: 30 },
            errorMessage: 'Họ tối đa 30 ký tự',
        },
    },
    email: {
        isEmail: {
            errorMessage: 'Email không hợp lệ',
        },
        notEmpty: {
            errorMessage: 'Vui lòng nhập email',
        },
    },
    phoneNumber: {
        matches: {
            options: [/^\d{10}$/],
            errorMessage: 'Số điện thoại phải từ 10 đến 15 chữ số',
        },
    },
    password: {
        notEmpty: {
            errorMessage: 'Vui lòng nhập mật khẩu',
        },
        isLength: {
            options: { min: 6, max: 32 },
            errorMessage: 'Mật khẩu phải từ 6 đến 32 ký tự',
        },
    },
};           