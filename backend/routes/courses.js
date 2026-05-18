import express from 'express';
import db from '../config/db.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// GET /courses - all authenticated roles can view courses
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const [courses] = await db.query('SELECT * FROM courses');
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching courses' });
    }
});

// POST /courses - admin only
router.post(
    '/',
    isAuthenticated,
    isAdmin,
    [
        body('name').notEmpty().withMessage('Course name is required'),
        body('code').notEmpty().withMessage('Course code is required'),
        body('credits').isInt({ min: 1 }).withMessage('Credits must be a positive integer'),
        body('description').optional().isString()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, code, credits, description } = req.body;
            const [result] = await db.query(
                'INSERT INTO courses (name, code, credits, description) VALUES (?, ?, ?, ?)',
                [name, code, credits, description]
            );
            res.status(201).json({ message: 'Course created', courseId: result.insertId });
        } catch (error) {
            console.error(error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Course code already exists' });
            }
            res.status(500).json({ message: 'Server error creating course' });
        }
    }
);

export default router;
