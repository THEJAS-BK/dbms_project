import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Settings2,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  Users,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { fetchApi } from '@/lib/api';

interface Course {
  id: number;
  code: string;
  name: string;
  faculty: string;
  enrolled_students: number;
  max_seats: number;
  level: string;
  status: string;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCourses = () => {
    fetchApi('/courses')
      .then(data => setCourses(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    try {
      await fetchApi(`/courses/${id}`, { method: 'DELETE' });
      loadCourses();
    } catch (err: any) {
      alert(err.message || 'Failed to delete course');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">Course Management</h2>
          <p className="text-on-surface-variant font-medium">Control the institutional curriculum and enrollment parameters.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-surface-tint active:scale-95">
          <Plus className="h-5 w-5" />
          Create New Course
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm"
      >
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-surface-container px-6 py-6 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Filter by course title, code or faculty..."
              className="w-full rounded-xl border border-outline-variant bg-surface-container-low py-3 pl-10 pr-4 text-sm font-medium transition-all focus:border-primary outline-none shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-xl border border-outline-variant px-4 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-all">
              <Filter className="h-4 w-4" />
              Faculty
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-outline-variant px-4 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-all">
              <Settings2 className="h-4 w-4" />
              Columns
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 text-on-surface-variant">No courses found.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/50">
                  {['Course Info', 'Department', 'Enrollment', 'Status', 'Actions'].map((h, i) => (
                    <th key={h} className={cn(
                      "px-8 py-5 text-[10px] font-black uppercase tracking-wider text-on-surface-variant",
                      i === 4 ? "text-right" : ""
                    )}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {courses.map((course) => {
                  const enrolled = course.enrolled_students || 0;
                  const max = course.max_seats || 50;
                  const isFull = enrolled >= max;

                  return (
                    <tr key={course.id} className="transition-colors hover:bg-surface-container-low/30">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <span className="rounded bg-primary-container px-2 py-0.5 text-[10px] font-black tracking-widest text-on-primary-container">
                            {course.code}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-on-surface leading-tight">{course.name}</p>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1 opacity-60">{course.level || 'Undergraduate'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-on-surface-variant">{course.faculty || 'General'}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="flex grow space-x-1.5 items-center">
                            <div className="h-1.5 grow bg-surface-container rounded-full overflow-hidden">
                              <div
                                className={cn("h-full rounded-full transition-all", isFull ? 'bg-error' : 'bg-primary')}
                                style={{ width: `${Math.min((enrolled / max) * 100, 100)}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-black text-on-surface-variant tabular-nums min-w-[40px]">
                              {enrolled}/{max}
                            </span>
                          </div>
                          <Users className="h-3.5 w-3.5 text-on-surface-variant opacity-40 shrink-0" />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest",
                          course.status === 'Active' ? 'bg-green-100 text-green-700' :
                            isFull || course.status === 'Full' ? 'bg-amber-100 text-amber-700' : 'bg-surface-container-highest text-on-surface-variant'
                        )}>
                          {course.status || 'Open'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/admin/courses/${course.id}/detail`)}
                            className="rounded-lg p-2 text-on-surface-variant hover:bg-primary-container/20 hover:text-primary transition-all"
                            title="View Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                            className="rounded-lg p-2 text-on-surface-variant hover:bg-primary-container/20 hover:text-primary transition-all"
                            title="Edit Course"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="rounded-lg p-2 text-on-surface-variant hover:bg-error-container/20 hover:text-error transition-all"
                            title="Delete Course"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
