import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  FlaskConical as Biotech,
  Braces as DataObject,
  Globe,
  History
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const registrations = [
  {
    name: 'Advanced Molecular Biology',
    instructor: 'Prof. Eleanor Vance',
    code: 'BIO-402',
    date: 'Aug 24, 2023',
    status: 'Enrolled',
    icon: Biotech,
  },
  {
    name: 'Data Structures & Algorithms',
    instructor: 'Dr. Marcus Thorne',
    code: 'CS-201',
    date: 'Aug 25, 2023',
    status: 'Enrolled',
    icon: DataObject,
  },
  {
    name: 'Macroeconomics II',
    instructor: 'Prof. Sarah Jenkins',
    code: 'ECON-305',
    date: 'Sep 02, 2023',
    status: 'Waitlisted',
    icon: Globe,
  },
  {
    name: 'History of Modern Art',
    instructor: 'Dr. Julianne Moore',
    code: 'ART-110',
    date: 'Sep 05, 2023',
    status: 'Enrolled',
    icon: History,
  }
];

export default function MySchedule() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight text-on-surface">My Registrations</h2>
        <p className="text-on-surface-variant font-medium">Manage your current course enrollments and academic schedule for the active term.</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Active', value: '4 Courses', sub: '12 Total Credits', icon: Biotech, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Pending', value: '1 Course', sub: 'Waitlist Position: 3', icon: History, color: 'text-secondary', bg: 'bg-secondary/10' },
          { label: 'Timeline', value: 'Oct 12', sub: 'Registration Deadline', icon: Globe, color: 'text-primary', bg: 'bg-primary/10' }
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className={cn("rounded-lg p-2.5", item.bg)}>
                <item.icon className={cn("h-6 w-6", item.color)} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                {item.label}
              </span>
            </div>
            <p className="text-3xl font-bold text-on-surface tracking-tight">{item.value}</p>
            <p className="mt-1 text-sm font-medium text-on-surface-variant">{item.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Table Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm"
      >
        {/* Controls */}
        <div className="flex flex-col gap-4 border-b border-surface-container px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search courses or codes..." 
              className="w-full rounded-xl border border-outline-variant bg-surface-container-low py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-all shadow-sm">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary-container active:scale-95">
              <Plus className="h-4 w-4" />
              Add Course
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                {['Course Name', 'Course Code', 'Registration Date', 'Status', ''].map((h, i) => (
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
              {registrations.map((reg) => (
                <tr key={reg.code} className="transition-colors hover:bg-surface-container-low/30">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 text-primary border border-primary/10">
                        <reg.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-on-surface tracking-tight">{reg.name}</p>
                        <p className="text-xs font-medium text-on-surface-variant mt-0.5">{reg.instructor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-on-surface-variant font-mono">{reg.code}</td>
                  <td className="px-8 py-6 text-sm font-semibold text-on-surface">{reg.date}</td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest",
                      reg.status === 'Enrolled' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700 font-bold"
                    )}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-on-surface-variant hover:text-primary transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-surface-container bg-surface-container-low/20 px-8 py-6">
          <p className="text-sm font-medium text-on-surface-variant">
            Showing <span className="font-bold text-on-surface">1</span> to <span className="font-bold text-on-surface">4</span> of <span className="font-bold text-on-surface">12</span> courses
          </p>
          <div className="flex items-center gap-2">
            <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-outline-variant px-4 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-all disabled:opacity-50">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <div className="flex gap-1">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-on-primary">1</button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-surface-container-high text-sm font-bold text-on-surface-variant">2</button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-surface-container-high text-sm font-bold text-on-surface-variant">3</button>
            </div>
            <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-outline-variant px-4 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-all">
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
