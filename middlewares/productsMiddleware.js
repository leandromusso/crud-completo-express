const { check } = require('express-validator');

//Solo valido el nombre y el precio, ya que el resto de los campos son opcionales

const productCreateValidator = [
    check('name')
        .notEmpty().withMessage('Debes ingresar un nombre').bail()
        .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres'),
    check('price')
        .notEmpty().withMessage('Debes ingresar un precio').bail()
        .isInt({ min: 1 }).withMessage('El precio debe ser un número entero mayor a 0')
];

module.exports = productCreateValidator;