/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetail from './pages/CourseDetail';
import MySchedule from './pages/MySchedule';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourses from './pages/AdminCourses';
import AdminEditCourse from './pages/AdminEditCourse';
import React from 'react';
import AdminRecords from './pages/AdminRecords';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen w-screen items-center justify-center bg-surface-container-lowest">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Redirect admin away from student-only routes to admin dashboard
  if (!adminOnly && user.role === 'admin') {
    return <Navigate to="/admin/overview" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated Portal Routes (Students) */}
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="catalog" element={<CourseCatalog />} />
            <Route path="catalog/:id" element={<CourseDetail />} />
            <Route path="schedule" element={<MySchedule />} />
            <Route path="profile" element={<Profile />} />

            <Route path="overview" element={<Navigate to="/" replace />} />
            <Route path="messages" element={<div className="p-10 font-bold text-center border-2 border-dashed border-outline-variant rounded-3xl">Messaging System - Integration in progress</div>} />
            <Route path="reports" element={<div className="p-10 font-bold text-center border-2 border-dashed border-outline-variant rounded-3xl">Academic Reports - Integration in progress</div>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AppLayout /></ProtectedRoute>}>
            <Route path="overview" element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="courses/:id/edit" element={<AdminEditCourse />} />
            <Route path="courses/:id/detail" element={<CourseDetail />} />
            <Route path="records" element={<AdminRecords />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
