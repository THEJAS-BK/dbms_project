import express from 'express';
import db from '../config/db.js';
import { isAuthenticated, isStudent, isAdmin } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// GET /student-details - admin only
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [details] = await db.query(`
            SELECT sd.*, u.username 
            FROM student_details sd
            JOIN users u ON sd.student_id = u.id
        `);
        res.json(details);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching all student details' });
    }
});

// GET /student-details/:id - student (own) or admin
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const studentId = parseInt(req.params.id, 10);
        const { userId, role } = req.session.user;

        if (role !== 'admin' && userId !== studentId) {
            return res.status(403).json({ message: 'Forbidden. Cannot view other student details.' });
        }

        const [details] = await db.query('SELECT * FROM student_details WHERE student_id = ?', [studentId]);
        if (details.length === 0) {
            return res.status(404).json({ message: 'Student details not found' });
        }

        res.json(details[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching student details' });
    }
});

// Validation middleware for student details
const validateStudentDetails = [
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').optional().isString(),
    body('qualification').optional().isString(),
    body('physics_marks').isFloat({ min: 0, max: 100 }).withMessage('Physics marks must be between 0 and 100'),
    body('chemistry_marks').isFloat({ min: 0, max: 100 }).withMessage('Chemistry marks must be between 0 and 100'),
    body('maths_marks').isFloat({ min: 0, max: 100 }).withMessage('Maths marks must be between 0 and 100'),
    body('program').optional().isString(),
    body('level').optional().isString(),
    body('gpa').optional().isFloat(),
    body('status').optional().isString()
];

// POST /student-details - student submits profile
router.post('/', isAuthenticated, isStudent, validateStudentDetails, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const studentId = req.session.user.userId;
        const { full_name, email, phone, qualification, physics_marks, chemistry_marks, maths_marks, program, level, gpa, status } = req.body;

        const [result] = await db.query(
            `INSERT INTO student_details 
            (student_id, full_name, email, phone, qualification, physics_marks, chemistry_marks, maths_marks, program, level, gpa, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [studentId, full_name, email, phone, qualification, physics_marks, chemistry_marks, maths_marks, program || 'Undeclared', level || 'Year 1', gpa || 0.00, status || 'In Good Standing']
        );

        res.status(201).json({ message: 'Student profile submitted successfully' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Profile already exists or email is already in use.' });
        }
        res.status(500).json({ message: 'Server error saving student details' });
    }
});

// PUT /student-details/:id - student updates own profile
router.put('/:id', isAuthenticated, isStudent, validateStudentDetails, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const paramId = parseInt(req.params.id, 10);
        const studentId = req.session.user.userId;

        if (studentId !== paramId) {
            return res.status(403).json({ message: 'Forbidden. You can only update your own profile.' });
        }

        const { full_name, email, phone, qualification, physics_marks, chemistry_marks, maths_marks, program, level, gpa, status } = req.body;

        const [result] = await db.query(
            `UPDATE student_details 
            SET full_name = ?, email = ?, phone = ?, qualification = ?, physics_marks = ?, chemistry_marks = ?, maths_marks = ?, program = ?, level = ?, gpa = ?, status = ?
            WHERE student_id = ?`,
            [full_name, email, phone, qualification, physics_marks, chemistry_marks, maths_marks, program, level, gpa, status, studentId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Profile not found to update' });
        }

        res.json({ message: 'Student profile updated successfully' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already in use.' });
        }
        res.status(500).json({ message: 'Server error updating student details' });
    }
});

export default router;
