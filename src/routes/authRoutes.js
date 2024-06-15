/** 
 * @swagger
 * components:
 *    schemas: 
 *       Users:
 *          type: object
 *           required:
 *            - fullName
 *            - email
 *             - password
 *           properties:
 *             _id:
 *                type: string
 *                description: This auto generated
 *             fullName:
 *                type: string
 *                description: User full name
 *             email:
 *                type: string
 *                description: User email
 *             password:
 *                type: string
 *                description: User password
 *             createdAt:
 *                type: string
 *                description: User created
 *                format: date
 * **/


import express from 'express';
import { signInUser, signUpUser } from '../controllers/authControllers.js';

const router = express.Router()

router.post('/auth/register', signUpUser)
router.post('/auth/login', signInUser)

export default router