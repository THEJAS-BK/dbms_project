import db from './config/db.js';

const courses = [
  {
    name: 'Introduction to Software Engineering',
    code: 'CS302',
    credits: 4,
    description: 'Detailed exploration of software engineering principles, agile methodologies, and SDLC.',
    faculty: 'Computer Science',
    max_seats: 50,
    instructor: 'Prof. Alan Turing',
    level: 'Undergraduate',
    status: 'Open'
  },
  {
    name: 'Discrete Mathematics II',
    code: 'MATH205',
    credits: 3,
    description: 'In-depth study of fundamental discrete math structures.',
    faculty: 'Mathematics',
    max_seats: 60,
    instructor: 'Dr. Ada Lovelace',
    level: 'Undergraduate',
    status: 'Open'
  },
  {
    name: 'Cognitive Psychology',
    code: 'PSY101',
    credits: 3,
    description: 'Introduction to the study of mental processes such as attention, language use, memory, perception.',
    faculty: 'Psychology',
    max_seats: 120,
    instructor: 'Prof. William James',
    level: 'Undergraduate',
    status: 'Open'
  },
  {
    name: 'Global Economics',
    code: 'ECON402',
    credits: 4,
    description: 'Advanced macroeconomic concepts and global market analysis.',
    faculty: 'Business',
    max_seats: 40,
    instructor: 'Dr. Janet Yellen',
    level: 'Undergraduate',
    status: 'Open'
  },
  {
    name: 'Quantum Mechanics I',
    code: 'PHYS105',
    credits: 4,
    description: 'Introduction to the wave mechanics of particles.',
    faculty: 'Physics',
    max_seats: 25,
    instructor: 'Dr. Richard Feynman',
    level: 'Undergraduate',
    status: 'Waitlist'
  },
  {
    name: 'History of Digital Art',
    code: 'ART102',
    credits: 2,
    description: 'From early computer graphics to modern NFT culture and interactive media installations.',
    faculty: 'Humanities',
    max_seats: 30,
    instructor: 'Dr. Julianne Moore',
    level: 'Undergraduate',
    status: 'Open'
  }
];

async function seed() {
  try {
    console.log('Seeding courses...');
    for (const course of courses) {
      await db.query(
        'INSERT IGNORE INTO courses (name, code, credits, description, faculty, max_seats, instructor, level, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [course.name, course.code, course.credits, course.description, course.faculty, course.max_seats, course.instructor, course.level, course.status]
      );
      console.log(`Inserted course: ${course.code}`);
    }
    console.log('All courses seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding courses:', err);
    process.exit(1);
  }
}

seed();
