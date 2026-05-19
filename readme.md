# 🎓 Student Registration System

A full-stack, data-driven course enrollment and student registration portal built with **React**, **Express.js**, and **MySQL**. It features an elegant modernist dashboard layout, role-based controls (Student vs Admin panels), and fully secure session-based authentication.

---

## 🚀 Key Features

### 👤 Student Portal
- **Secure Registration & Login**: Interactive forms with dynamic field validation and secure password hashing via `bcrypt`.
- **Course Catalog**: Filterable search index of available courses across departments.
- **Detailed Course Views**: Dedicated detail pages containing full syllabus info, prerequisites, and credit mappings.
- **My Schedule**: Visual calendar representation showing all successfully enrolled courses and slot timings.
- **Dynamic Profile Management**: Editable personal/academic records that sync in real-time with the database.

### 🔑 Administrative Panel
- **Operational Dashboard**: An overview displaying live metric cards tracking total student population, course catalogs, system-wide enrollments, and enrollment completion rates.
- **Enrollment Trend Charting**: Dynamically interactive 6-month & 12-month bar graphs rendering course registration frequencies.
- **Course Administration**: Complete CRUD dashboard interface allowing administrators to create, read, update, or remove courses in real-time.
- **Action & Override Center**: Process overload waivers, late registration requests, and other exemptions directly.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React (v19) • Vite • TypeScript • Motion (Framer Motion) • Lucide React • Tailwind CSS (v4) |
| **Backend** | Node.js • Express.js • Express Sessions (`express-session` & `express-mysql-session`) • Express Validator |
| **Database** | MySQL (Connection pooling via `mysql2/promise`) |

---

## 📦 Directory Structure

```text
dbms_project/
├── backend/
│   ├── config/              # MySQL connection pooling setup
│   ├── middleware/          # Authentication & role authorization checks
│   ├── routes/              # Modular Express API endpoints (Auth, Courses, Admin, Registrations)
│   ├── server.js            # Express server entry point & middleware config
│   └── .env                 # Backend configuration keys
│
└── frontend/
    ├── src/
    │   ├── components/      # Shared layout, navbar, & modal components
    │   ├── contexts/        # AuthProvider for session management
    │   ├── pages/           # Admin Dashboard, Student Schedule, Profile, Login
    │   └── index.css        # Tailwind v4 theme styling overrides
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MySQL Server

### 1. Database Configuration
1. Initialize your local MySQL server.
2. Create a new database:
   ```sql
   CREATE DATABASE student_reg;
   ```
3. (Optional) Run any pending schemas or structure updates from `backend/update_schema.sql`.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install standard dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` root:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=student_reg
   SESSION_SECRET=super_secret_session_key_change_me
   FRONTEND_URL=http://localhost:3000
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install frontend packages:
   ```bash
   npm install
   ```
3. Run the frontend client in development mode:
   ```bash
   npm run dev
   ```
   The application will be accessible at **`http://localhost:3000`**.

---

## 🔐 Security Standards
- **Password Protection**: Salting and secure hashing using `bcrypt`.
- **Authorization**: Session-stored cookies (`httpOnly`) with custom middlewares implementing double role-based access checks (`isAuthenticated` and `isAdmin`).
- **Validation**: Server-side request sanitization using `express-validator` to neutralize injection patterns.
