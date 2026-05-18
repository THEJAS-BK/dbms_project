import { motion } from 'motion/react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  CheckCircle, 
  TrendingUp,
  Clock,
  ArrowUpRight,
  MoreVertical,
  Activity,
  UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Total Students', value: '1,248', trend: '+12%', color: 'text-primary', bg: 'bg-primary/10', icon: Users },
  { label: 'Total Courses', value: '256', trend: '+4%', color: 'text-indigo-600', bg: 'bg-indigo-100', icon: BookOpen },
  { label: 'Total Enrollments', value: '4,892', trend: '+18%', color: 'text-blue-600', bg: 'bg-blue-100', icon: GraduationCap },
  { label: 'Completion Rate', value: '94.2%', trend: '+2%', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle },
];

const pendingRequests = [
  { id: 1, name: 'Alice Smith', course: 'BIO-402', type: 'Course Overload', priority: 'High', date: '2h ago' },
  { id: 2, name: 'Bob Johnson', course: 'CS-201', type: 'Late Registration', priority: 'Medium', date: '5h ago' },
  { id: 3, name: 'Charlie Brown', course: 'MATH-205', type: 'Exemption Request', priority: 'Low', date: 'Yesterday' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">Administrative Overview</h2>
          <p className="text-on-surface-variant font-medium">System-wide performance metrics and active administrative tasks.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-outline-variant px-5 py-2.5 text-sm font-bold text-on-surface transition-all hover:bg-surface-container-high shadow-sm shadow-black/5 active:scale-95">
            Download State Report
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-surface-tint active:scale-95">
             <UserPlus className="h-4 w-4" />
             New Student
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className={cn("rounded-xl p-3", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span className="text-[10px] font-black">{stat.trend}</span>
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-70">{stat.label}</p>
            <p className="mt-1 text-3xl font-black text-on-surface tracking-tighter">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Activity Chart Placeholder */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm lg:col-span-8"
        >
          <div className="mb-10 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="bg-primary/10 p-2 rounded-lg">
                  <Activity className="h-6 w-6 text-primary" />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-on-surface tracking-tight">Enrollment Trends</h3>
                  <p className="text-xs text-on-surface-variant font-medium">Monthly course registrations across all faculties</p>
               </div>
             </div>
             <select className="rounded-lg border-none bg-surface-container px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-on-surface-variant outline-none focus:ring-2 focus:ring-primary/20">
               <option>Last 6 Months</option>
               <option>Yearly</option>
             </select>
          </div>
          
          <div className="flex h-64 items-end justify-between gap-2 px-2">
            {[40, 65, 55, 90, 75, 85].map((h, i) => (
              <div key={i} className="group relative w-full">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 1 }}
                  className={cn(
                    "w-full rounded-t-xl transition-all group-hover:opacity-100",
                    i === 3 ? "bg-primary" : "bg-primary/20 hover:bg-primary/40"
                  )}
                />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                   <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">
                     {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                   </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 flex items-center justify-center gap-10">
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Active Seats</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary/20" />
                <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Waitlisted</span>
             </div>
          </div>
        </motion.div>

        {/* Priority Sidebar */}
        <aside className="space-y-8 lg:col-span-4">
           {/* Admin Tasks */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm"
           >
             <div className="mb-6 flex items-center justify-between">
               <h3 className="text-lg font-bold tracking-tight text-on-surface">Action Center</h3>
               <ArrowUpRight className="h-4 w-4 text-primary" />
             </div>
             <div className="space-y-4">
               {pendingRequests.map(req => (
                 <div key={req.id} className="group flex items-center justify-between rounded-xl border border-outline-variant p-4 transition-all hover:bg-surface-container-low cursor-pointer">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 overflow-hidden rounded-full border border-outline-variant shadow-sm transition-transform group-hover:scale-105">
                         <img src={`https://i.pravatar.cc/100?u=${req.name}`} alt={req.name} />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-on-surface leading-none">{req.name}</p>
                         <p className="text-[10px] font-semibold text-on-surface-variant mt-1.5 uppercase tracking-widest">{req.type}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className={cn(
                         "text-[9px] font-black uppercase tracking-widest leading-none px-2 py-0.5 rounded",
                         req.priority === 'High' ? "text-error" : 
                         req.priority === 'Medium' ? "text-secondary" : "text-on-surface-variant"
                       )}>
                         {req.priority}
                       </span>
                    </div>
                 </div>
               ))}
             </div>
             <button className="mt-8 w-full rounded-xl bg-surface-container-high py-3 text-xs font-black uppercase tracking-widest text-on-surface-variant hover:bg-outline-variant transition-all">
                View All Requests
             </button>
           </motion.div>

           {/* Quick Announcement */}
           <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-secondary-container p-6 text-on-secondary-container shadow-lg"
           >
              <div className="flex items-center gap-2 mb-3">
                 <Clock className="h-5 w-5" />
                 <h4 className="font-bold tracking-tight">System Maintenance</h4>
              </div>
              <p className="text-xs font-normal leading-relaxed opacity-80">
                A scheduled database synchronization will occur on Oct 14th from 02:00 AM to 04:00 AM. Portal access will be intermittent.
              </p>
           </motion.div>
        </aside>
      </div>
    </div>
  );
}
