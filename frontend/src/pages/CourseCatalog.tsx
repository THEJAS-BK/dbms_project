import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  SortDesc as Sort, 
  CreditCard, 
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { fetchApi } from '@/lib/api';

const categories = [
  'All Courses', 
  'Computer Science', 
  'Mathematics', 
  'Physics', 
  'Business', 
  'Humanities'
];

interface Course {
  id: number;
  code: string;
  name: string;
  credits: number;
  description: string;
  status: string;
  max_seats: number;
  enrolled_students: number;
  faculty: string;
}

export default function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<number | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await fetchApi('/courses');
      setCourses(data);
    } catch (err: any) {
      setError('Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (courseId: number) => {
    try {
      setRegistering(courseId);
      await fetchApi('/registrations', {
        method: 'POST',
        body: JSON.stringify({ course_id: courseId })
      });
      // Optionally reload or show success
      await loadCourses();
    } catch (err: any) {
      alert(err.message || 'Failed to register');
    } finally {
      setRegistering(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Catalog Header & Filters */}
      <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">Course Catalog</h2>
          <p className="text-on-surface-variant font-medium">Explore and register for upcoming semester modules.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search by course name or code..." 
              className="w-full rounded-xl border border-outline-variant bg-surface-container-low py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-all shadow-sm">
            <Filter className="h-4 w-4" />
            <span>Categories</span>
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-all shadow-sm">
            <Sort className="h-4 w-4" />
            <span>Sort</span>
          </button>
        </div>
      </section>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={cn(
              "whitespace-nowrap rounded-full px-5 py-2 text-xs font-bold transition-all shadow-sm",
              i === 0 
                ? "bg-primary text-on-primary" 
                : "bg-surface-container-high text-on-surface-variant hover:bg-outline-variant"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-10 text-error">{error}</div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {courses.map((course, i) => {
            const seatsLeft = Math.max(0, (course.max_seats || 50) - (course.enrolled_students || 0));
            const status = course.status || 'Open';
            
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/catalog/${course.id}`)}
                className="group flex flex-col rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] cursor-pointer"
              >
                <div className="mb-6 flex items-start justify-between">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary tracking-wide">
                    {course.code}
                  </span>
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-xs font-bold">{course.credits} Credits</span>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="mt-8 border-t border-surface-container pt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "rounded px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide",
                      status === 'Open' ? 'bg-green-100 text-green-700' : 
                      status === 'Waitlist' ? 'bg-amber-100 text-amber-700' : 'bg-error-container text-error'
                    )}>
                      {status}
                    </span>
                    <span className="text-xs font-bold text-on-surface-variant">
                      • {seatsLeft}/{course.max_seats || 50} Seats left
                    </span>
                  </div>

                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRegister(course.id); }}
                    disabled={registering === course.id || seatsLeft === 0}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary-container active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {registering === course.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {seatsLeft === 0 ? 'Full' : 'Register'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </section>
      )}

      {/* Pagination */}
      {!loading && courses.length > 0 && (
        <div className="flex justify-center pt-10 pb-4">
          <button className="rounded-xl border border-outline-variant bg-surface-container-lowest px-12 py-3 text-sm font-bold text-on-surface transition-all hover:bg-surface-container-high shadow-sm shadow-black/5 active:scale-95">
            Load More Courses
          </button>
        </div>
      )}
    </div>
  );
}
