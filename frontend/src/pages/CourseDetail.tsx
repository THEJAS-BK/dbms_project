import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  Users,
  CreditCard,
  GraduationCap,
  User2,
  Building2,
  BarChart3,
  CheckCircle2,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Course {
  id: number;
  name: string;
  code: string;
  credits: number;
  description: string;
  faculty: string;
  max_seats: number;
  enrolled_students: number;
  instructor: string;
  level: string;
  status: string;
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchApi(`/courses/${id}`)
      .then(data => setCourse(data))
      .catch(() => setError('Course not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    if (!course) return;
    setRegistering(true);
    try {
      await fetchApi('/registrations', {
        method: 'POST',
        body: JSON.stringify({ course_id: course.id })
      });
      setRegistered(true);
      // Refresh enrollment count
      const updated = await fetchApi(`/courses/${id}`);
      setCourse(updated);
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <AlertTriangle className="h-12 w-12 text-error" />
        <p className="text-lg font-bold text-on-surface">{error || 'Course not found'}</p>
        <Link to="/catalog" className="text-sm font-bold text-primary hover:underline">← Back to Catalog</Link>
      </div>
    );
  }

  const seatsLeft = Math.max(0, (course.max_seats || 50) - (course.enrolled_students || 0));
  const fillPct = Math.min(100, Math.round(((course.enrolled_students || 0) / (course.max_seats || 50)) * 100));

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back Nav */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Catalog
      </button>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden"
      >
        {/* Top Banner */}
        <div className="bg-primary-container px-10 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-white/20 px-4 py-1 text-xs font-black tracking-widest text-white uppercase">
                {course.code}
              </span>
              <span className={cn(
                "rounded-full px-4 py-1 text-xs font-black uppercase tracking-widest",
                course.status === 'Open' ? 'bg-green-500/20 text-green-100' :
                course.status === 'Waitlist' ? 'bg-amber-500/20 text-amber-100' :
                'bg-red-500/20 text-red-100'
              )}>
                {course.status}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{course.name}</h1>
            <p className="text-white/70 font-medium">{course.faculty} · {course.level}</p>
          </div>

          {!isAdmin && (
            <div className="shrink-0">
              {registered ? (
                <div className="flex items-center gap-2 rounded-2xl bg-green-500 px-8 py-4 text-white font-bold shadow-lg">
                  <CheckCircle2 className="h-5 w-5" />
                  Registered!
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering || seatsLeft === 0}
                  className="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-primary shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registering && <Loader2 className="h-4 w-4 animate-spin" />}
                  {seatsLeft === 0 ? 'Course Full' : 'Register Now'}
                </button>
              )}
            </div>
          )}

          {isAdmin && (
            <Link
              to={`/admin/courses/${course.id}/edit`}
              className="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-black text-primary shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              Edit Course
            </Link>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-outline-variant border-b border-outline-variant">
          {[
            { icon: CreditCard, label: 'Credits', value: course.credits },
            { icon: Users, label: 'Enrolled', value: `${course.enrolled_students || 0} / ${course.max_seats}` },
            { icon: GraduationCap, label: 'Level', value: course.level || 'Undergraduate' },
            { icon: User2, label: 'Instructor', value: course.instructor || 'TBD' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center py-6 px-4 gap-2">
              <stat.icon className="h-5 w-5 text-primary" />
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{stat.label}</p>
              <p className="text-sm font-bold text-on-surface text-center">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Description */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                About this Course
              </h2>
              <p className="text-on-surface-variant leading-relaxed font-medium">
                {course.description || 'No description available for this course.'}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Department
              </h2>
              <p className="text-on-surface-variant font-medium">{course.faculty}</p>
            </div>
          </div>

          {/* Enrollment Widget */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-6 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Enrollment Status
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-on-surface">
                  <span>{course.enrolled_students || 0} enrolled</span>
                  <span>{seatsLeft} seats left</span>
                </div>
                <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fillPct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={cn(
                      "h-full rounded-full",
                      fillPct >= 90 ? 'bg-error' :
                      fillPct >= 70 ? 'bg-amber-500' : 'bg-primary'
                    )}
                  />
                </div>
                <p className="text-[10px] font-bold text-on-surface-variant">{fillPct}% full · {course.max_seats} total seats</p>
              </div>
            </div>

            {!isAdmin && seatsLeft > 0 && !registered && (
              <button
                onClick={handleRegister}
                disabled={registering}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-black text-on-primary shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
              >
                {registering && <Loader2 className="h-4 w-4 animate-spin" />}
                {registering ? 'Registering...' : 'Register for this Course'}
              </button>
            )}
            {registered && (
              <div className="w-full flex items-center justify-center gap-2 rounded-2xl bg-green-500 py-4 text-sm font-black text-white">
                <CheckCircle2 className="h-4 w-4" />
                Successfully Registered
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
