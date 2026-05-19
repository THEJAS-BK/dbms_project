import db from './config/db.js';
import bcrypt from 'bcrypt';

async function seedAdmin() {
    try {
        const username = 'admin';
        const password = 'password123';
        const role = 'admin';

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await db.query(
            'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password_hash = ?, role = ?',
            [username, hash, role, hash, role]
        );
        console.log('Admin user seeded successfully!');
        console.log('-----------------------------------');
        console.log('Username: admin');
        console.log('Password: password123');
        console.log('-----------------------------------');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin:', err);
        process.exit(1);
    }
}

seedAdmin();
