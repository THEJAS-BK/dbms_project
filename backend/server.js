import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import MySQLStoreFactory from 'express-mysql-session';
import db from './config/db.js';

import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import registrationRoutes from './routes/registrations.js';
import studentDetailsRoutes from './routes/studentDetails.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Session Store Setup
const MySQLStore = MySQLStoreFactory(session);
const sessionStore = new MySQLStore({
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000,
    createDatabaseTable: true
}, db);

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'super_secret_session_key_change_me',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// API Routes
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/registrations', registrationRoutes);
app.use('/student-details', studentDetailsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
