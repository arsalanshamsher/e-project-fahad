import { body } from 'express-validator';

export const validateBooth = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Booth name must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  
  body('type')
    .isIn(['standard', 'premium', 'vip', 'corner', 'island'])
    .withMessage('Invalid booth type'),
  
  body('size')
    .trim()
    .notEmpty()
    .withMessage('Size is required'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('maxCapacity')
    .isInt({ min: 1 })
    .withMessage('Maximum capacity must be at least 1'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  
  body('amenities')
    .isArray({ min: 1 })
    .withMessage('At least one amenity is required'),
  
  body('amenities.*')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Amenity names must be non-empty strings'),
  
  body('status')
    .optional()
    .isIn(['available', 'reserved', 'occupied', 'maintenance'])
    .withMessage('Invalid status'),
  
  body('expoId')
    .isMongoId()
    .withMessage('Invalid expo ID'),
];

export const validateBoothUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Booth name must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  
  body('type')
    .optional()
    .isIn(['standard', 'premium', 'vip', 'corner', 'island'])
    .withMessage('Invalid booth type'),
  
  body('size')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Size cannot be empty'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('maxCapacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum capacity must be at least 1'),
  
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty'),
  
  body('amenities')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one amenity is required'),
  
  body('amenities.*')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Amenity names must be non-empty strings'),
  
  body('status')
    .optional()
    .isIn(['available', 'reserved', 'occupied', 'maintenance'])
    .withMessage('Invalid status'),
];
