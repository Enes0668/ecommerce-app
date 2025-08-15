/**
 * @swagger
 * tags:
 *   name: Protected
 *   description: Korunan rotalar
 */

/**
 * @swagger
 * /api/protected:
 *   get:
 *     summary: Token ile korunan rotaya erişim
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı erişim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Protected route accessed
 *       401:
 *         description: Token geçersiz veya eksik
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const express = require('express');
 const router = express.Router();
 const verifyToken = require('../middleware/authMiddleware');
// Protected route
 router.get('/', verifyToken, (req, res) => {
 res.status(200).json({ message: 'Protected route accessed' });
 });

module.exports = router;