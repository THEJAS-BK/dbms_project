import { 
  Search, 
  Filter, 
  Plus, 
  Settings2, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const adminCourses = [
  { id: 1, code: 'CS302', name: 'Software Engineering', faculty: 'Science', students: 48, max: 50, level: 'Year 3', status: 'Active' },
  { id: 2, code: 'MATH205', name: 'Discrete Math II', faculty: 'Science', students: 58, max: 60, level: 'Year 2', status: 'Active' },
  { id: 3, code: 'PSY101', name: 'Intro Psychology', faculty: 'Arts', students: 120, max: 120, level: 'Year 1', status: 'Full' },
  { id: 4, code: 'ECON402', name: 'Global Economics', faculty: 'Business', students: 35, max: 40, level: 'Year 4', status: 'Active' },
  { id: 5, code: 'BIO-201', name: 'Cell Biology', faculty: 'Science', students: 0, max: 45, level: 'Year 2', status: 'Draft' },
];

export default function AdminCourses() {
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
              {adminCourses.map((course) => (
                <tr key={course.id} className="transition-colors hover:bg-surface-container-low/30">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <span className="rounded bg-primary-container px-2 py-0.5 text-[10px] font-black tracking-widest text-on-primary-container">
                         {course.code}
                       </span>
                       <div>
                         <p className="text-sm font-bold text-on-surface leading-tight">{course.name}</p>
                         <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1 opacity-60">{course.level}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-on-surface-variant">{course.faculty}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="flex grow space-x-1.5 items-center">
                          <div className="h-1.5 grow bg-surface-container rounded-full overflow-hidden">
                             <div 
                               className={cn("h-full rounded-full transition-all", course.students >= course.max ? 'bg-error' : 'bg-primary')} 
                               style={{ width: `${(course.students/course.max) * 100}%` }}
                             />
                          </div>
                          <span className="text-[10px] font-black text-on-surface-variant tabular-nums min-w-[40px]">
                            {course.students}/{course.max}
                          </span>
                       </div>
                       <Users className="h-3.5 w-3.5 text-on-surface-variant opacity-40 shrink-0" />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest",
                      course.status === 'Active' ? 'bg-green-100 text-green-700' : 
                      course.status === 'Full' ? 'bg-amber-100 text-amber-700' : 'bg-surface-container-highest text-on-surface-variant'
                    )}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                       <button className="rounded-lg p-2 text-on-surface-variant hover:bg-primary-container/20 hover:text-primary transition-all">
                          <Eye className="h-4 w-4" />
                       </button>
                       <button className="rounded-lg p-2 text-on-surface-variant hover:bg-primary-container/20 hover:text-primary transition-all">
                          <Edit3 className="h-4 w-4" />
                       </button>
                       <button className="rounded-lg p-2 text-on-surface-variant hover:bg-error-container/20 hover:text-error transition-all">
                          <Trash2 className="h-4 w-4" />
                       </button>
                       <button className="rounded-lg p-2 text-on-surface-variant transition-all">
                          <MoreVertical className="h-4 w-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
