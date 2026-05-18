import { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen as AutoStories, 
  ShieldCheck, 
  Info,
  Code,
  Sigma,
  Brain,
  Globe,
  MoreVertical,
  Calendar,
  Mail,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { fetchApi } from '@/lib/api';

interface Registration {
  course_id: number;
  name: string;
  code: string;
  credits: number;
  registration_date: string;
  instructor?: string;
  status?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const regs = await fetchApi('/registrations/my');
        setRegistrations(regs);

        try {
          const profile = await fetchApi(`/student-details/${user.userId}`);
          let completion = 20; // base for just having an account
          if (profile.full_name) completion += 20;
          if (profile.phone) completion += 20;
          if (profile.qualification) completion += 20;
          if (profile.program !== 'Undeclared') completion += 20;
          setProfileCompletion(completion);
        } catch (e) {
          // Profile might not exist yet
          setProfileCompletion(10);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const stats = [
    {
      label: 'Current Semester',
      value: registrations.length.toString(),
      sublabel: 'Registered Courses',
      icon: AutoStories,
      color: 'text-primary',
      bg: 'bg-primary-container/10',
      span: 'col-span-12 md:col-span-4'
    },
    {
      label: 'Onboarding Progress',
      value: `${profileCompletion}%`,
      sublabel: 'Profile Completion',
      icon: ShieldCheck,
      color: 'text-secondary',
      bg: 'bg-secondary-container/10',
      span: 'col-span-12 md:col-span-8',
      progress: profileCompletion,
      info: profileCompletion < 100 ? 'Complete your profile to reach 100%.' : 'Your profile is fully complete!'
    }
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-primary-container p-8 md:p-10 shadow-lg text-white"
      >
        <div className="absolute right-0 top-0 hidden h-full w-1/3 items-center justify-center bg-gradient-to-l from-on-primary-container/20 to-transparent lg:flex">
          <GraduationCap className="h-40 w-40 opacity-10" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <h2 className="mb-2 text-3xl font-bold md:text-4xl tracking-tight">Welcome back, {user?.username}</h2>
          <p className="text-lg text-on-primary-container/90">
            You're doing great this semester! You have registered for {registrations.length} courses and your profile is {profileCompletion}% complete.
          </p>
          <div className="mt-8 flex gap-4">
            <button className="rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-primary shadow-sm hover:shadow-md transition-all active:scale-95">
              View Schedule
            </button>
            <button className="rounded-lg border border-white/30 px-6 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-all active:scale-95">
              My Records
            </button>
          </div>
        </div>
      </motion.section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-12 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 transition-all hover:shadow-md ${stat.span}`}
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-xl p-3 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                {stat.label}
              </span>
            </div>

            <div className="mt-6">
              {stat.progress !== undefined ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-black text-on-surface tracking-tighter">{stat.value}</p>
                      <p className="text-sm font-bold text-on-surface-variant">{stat.sublabel}</p>
                    </div>
                    <span className="text-xs font-bold text-primary">Almost there!</span>
                  </div>
                  <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-primary rounded-full transition-all"
                    />
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <Info className="h-3.5 w-3.5" />
                    {stat.info}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col">
                   <p className="text-5xl font-black text-on-surface tracking-tighter leading-none">{stat.value}</p>
                   <p className="text-sm font-bold text-on-surface-variant mt-1">{stat.sublabel}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-12 gap-8">
        {/* Course Table */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-12 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm lg:col-span-8"
        >
          <div className="flex items-center justify-between border-b border-surface-container px-8 py-6">
            <h3 className="text-xl font-bold text-on-surface tracking-tight">Recent Registered Courses</h3>
            <button className="text-sm font-bold text-primary hover:underline">View Catalog</button>
          </div>
          
          <div className="overflow-x-auto">
            {registrations.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant">No recent registrations.</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    {['Course Name', 'Code', 'Credits', 'Status', 'Action'].map((header) => (
                      <th key={header} className="px-8 py-4 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {registrations.slice(0, 5).map((course) => (
                    <tr key={course.code} className="transition-colors hover:bg-surface-container-low/30">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100`}>
                            <BookOpen className={`h-5 w-5 text-blue-600`} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">{course.name}</p>
                            <p className="text-[10px] text-on-surface-variant font-medium">{course.instructor || 'TBD'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-xs font-semibold text-on-surface-variant">{course.code}</td>
                      <td className="px-8 py-5 text-xs font-semibold text-on-surface-variant">{course.credits}</td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wide",
                          "bg-green-100 text-green-700"
                        )}>
                          {course.status || 'Enrolled'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <button className="text-on-surface-variant hover:text-primary transition-colors">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {registrations.length > 5 && (
            <div className="border-t border-surface-container bg-surface-container-low/20 px-8 py-4 text-center">
              <button className="text-xs font-bold text-on-surface-variant hover:text-primary transition-all">
                Show More Courses
              </button>
            </div>
          )}
        </motion.div>

        {/* Sidebar Cards */}
        <aside className="col-span-12 space-y-8 lg:col-span-4">
          {/* Advisor Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm"
          >
            <h3 className="mb-6 text-xl font-bold text-on-surface tracking-tight">Academic Advisor</h3>
            <div className="mb-8 flex items-center gap-4">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl6EqPN6859STYPZCFuz1o_BjA9mK-Dwf2j3jlznluYR6M_u2pvEC_yVxSB3c0jEFxKa6MTE7_mtQ-77wXhGZfS17ZQrDbF9V7P6PCJZdDbzEgU03GIiwzBN_mwPOG5RvxaawSdjoaHYbSUQ85aIICrNmAuJdcwlVeJhYoQkNUqcHl7TdwKReTXemdKEzT7tu35ei39iboC7x6YEJO2Y6jwIKswaxxcOXx5eJ6knNcAnaFqp9BZi0Ppj9wApA-G_Qc4lbdj4cgLnk"
                alt="Advisor"
                className="h-16 w-16 rounded-2xl object-cover shadow-sm"
              />
              <div>
                <p className="text-lg font-bold text-on-surface leading-tight">Dr. Sarah Jenkins</p>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Faculty of Science</p>
              </div>
            </div>
            <div className="space-y-3">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-on-primary hover:opacity-90 shadow-md shadow-primary/10 transition-all active:scale-98">
                <Calendar className="h-4 w-4" />
                Book Meeting
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant py-3 text-xs font-bold text-on-surface hover:bg-surface-container transition-all active:scale-98">
                <Mail className="h-4 w-4" />
                Send Message
              </button>
            </div>
          </motion.div>

          {/* Deadline Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-error/10 bg-error-container/20 p-8 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-error fill-error/20" />
              <h3 className="font-bold text-error tracking-tight">Registration Status</h3>
            </div>
            <p className="mb-6 text-sm text-on-error-container leading-relaxed">
              Ensure you have registered for all required courses. Check with your advisor to confirm your schedule.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-xs font-bold text-error transition-all hover:translate-x-1 hover:underline">
              Review Registration
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        </aside>
      </section>
    </div>
  );
}
