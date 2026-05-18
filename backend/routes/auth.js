import express from 'express';
import bcrypt from 'bcrypt';
import db from '../config/db.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// POST /auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password required' });
        }

        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        req.session.user = {
            userId: user.id,
            username: user.username,
            role: user.role,
            branch: user.branch
        };

        res.json({ message: 'Login successful', user: req.session.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
    });
});

// GET /auth/me
router.get('/me', isAuthenticated, (req, res) => {
    res.json({ user: req.session.user });
});

// Utility route to register a new user (for testing/setup)
router.post('/register', async (req, res) => {
    try {
        const { username, password, role, branch } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({ message: 'Missing fields' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        await db.query(
            'INSERT INTO users (username, password_hash, role, branch) VALUES (?, ?, ?, ?)',
            [username, hash, role, branch || null]
        );
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

export default router;
