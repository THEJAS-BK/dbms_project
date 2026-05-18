export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
};

export const isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Forbidden. Admin access required.' });
};

export const isStudent = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'student') {
        return next();
    }
    return res.status(403).json({ message: 'Forbidden. Student access required.' });
};
