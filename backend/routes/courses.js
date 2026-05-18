import express from 'express';
import db from '../config/db.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// GET /courses - all authenticated roles can view courses
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const [courses] = await db.query(`
            SELECT c.*, COUNT(r.student_id) as enrolled_students
            FROM courses c
            LEFT JOIN registrations r ON c.id = r.course_id
            GROUP BY c.id
        `);
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching courses' });
    }
});

// GET /courses/:id - single course detail
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const [courses] = await db.query(`
            SELECT c.*, COUNT(r.student_id) as enrolled_students
            FROM courses c
            LEFT JOIN registrations r ON c.id = r.course_id
            WHERE c.id = ?
            GROUP BY c.id
        `, [req.params.id]);

        if (courses.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(courses[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching course' });
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
        body('description').optional().isString(),
        body('faculty').optional().isString(),
        body('max_seats').optional().isInt({ min: 1 }),
        body('instructor').optional().isString(),
        body('level').optional().isString(),
        body('status').optional().isString()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, code, credits, description, faculty, max_seats, instructor, level, status } = req.body;
            const [result] = await db.query(
                'INSERT INTO courses (name, code, credits, description, faculty, max_seats, instructor, level, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [name, code, credits, description, faculty || 'General', max_seats || 50, instructor || 'TBD', level || 'Undergraduate', status || 'Open']
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

// PUT /courses/:id - admin only
router.put(
    '/:id',
    isAuthenticated,
    isAdmin,
    [
        body('name').notEmpty().withMessage('Course name is required'),
        body('code').notEmpty().withMessage('Course code is required'),
        body('credits').isInt({ min: 1 }).withMessage('Credits must be a positive integer'),
        body('description').optional().isString(),
        body('faculty').optional().isString(),
        body('max_seats').optional().isInt({ min: 1 }),
        body('instructor').optional().isString(),
        body('level').optional().isString(),
        body('status').optional().isString()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, code, credits, description, faculty, max_seats, instructor, level, status } = req.body;
            const [result] = await db.query(
                'UPDATE courses SET name=?, code=?, credits=?, description=?, faculty=?, max_seats=?, instructor=?, level=?, status=? WHERE id=?',
                [name, code, credits, description, faculty, max_seats, instructor, level, status, req.params.id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Course not found' });
            }
            res.json({ message: 'Course updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error updating course' });
        }
    }
);

// DELETE /courses/:id - admin only
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error deleting course' });
    }
});

export default router;
