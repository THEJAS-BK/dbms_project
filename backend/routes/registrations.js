import express from 'express';
import db from '../config/db.js';
import { isAuthenticated, isStudent } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// POST /registrations - student only
router.post(
    '/',
    isAuthenticated,
    isStudent,
    [
        body('course_id').isInt().withMessage('Valid course ID is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { course_id } = req.body;
            const student_id = req.session.user.userId;

            // Optional: check if course exists
            const [course] = await db.query('SELECT id FROM courses WHERE id = ?', [course_id]);
            if (course.length === 0) {
                return res.status(404).json({ message: 'Course not found' });
            }

            await db.query(
                'INSERT INTO registrations (student_id, course_id) VALUES (?, ?)',
                [student_id, course_id]
            );
            res.status(201).json({ message: 'Registration successful' });
        } catch (error) {
            console.error(error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Already registered for this course' });
            }
            res.status(500).json({ message: 'Server error during registration' });
        }
    }
);

// GET /registrations/my - student sees own registrations
router.get('/my', isAuthenticated, isStudent, async (req, res) => {
    try {
        const student_id = req.session.user.userId;
        const [registrations] = await db.query(`
            SELECT r.registration_date, c.id as course_id, c.name, c.code, c.credits, c.description
            FROM registrations r
            JOIN courses c ON r.course_id = c.id
            WHERE r.student_id = ?
        `, [student_id]);
        
        res.json(registrations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching registrations' });
    }
});

export default router;
