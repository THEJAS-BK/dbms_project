import { motion } from 'motion/react';
import { 
  Camera, 
  Save, 
  Award, 
  FileCheck, 
  TrendingUp,
  Bolt,
  FlaskConical,
  Calculator,
  ChevronRight,
  Medal
} from 'lucide-react';
import { cn } from '@/lib/utils';

const academics = [
  { id: 'physics', label: 'Physics Marks', value: 85, tag: 'TOP 10%', color: 'text-indigo-600', bg: 'bg-indigo-100', icon: Bolt },
  { id: 'chemistry', label: 'Chemistry Marks', value: 78, tag: 'AVERAGE', color: 'text-blue-600', bg: 'bg-blue-100', icon: FlaskConical },
  { id: 'maths', label: 'Maths Marks', value: 92, tag: 'DISTINCTION', color: 'text-purple-600', bg: 'bg-purple-100', icon: Calculator },
];

export default function Profile() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">My Profile</h2>
          <p className="text-on-surface-variant font-medium">Manage your academic identity and personal information.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary-container px-6 py-2.5 text-sm font-bold text-on-primary-container shadow-sm hover:opacity-90 transition-all active:scale-95">
          <Save className="h-4 w-4" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Profile Card & Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm lg:col-span-8"
        >
          {/* Avatar Section */}
          <div className="mb-10 flex items-center gap-6">
            <div className="relative group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvdDNmDGGx2OFNY5hFRafIoX3ACRrs8l9IdbbaF3LSaJ7cTA9tYH7zkN31n6yGyifjzZxYBNFmDIWgMx8xc-B8PBCn1ehvcPcG0f5IGTizOt6E2sembclhD0-JcWk8JUfuvaxqjNHpXi4k9cNo7hJcctx5usjhWs45Ulxt3KHzxJiwcyVCgepZJhDVubfvtR7kN7uAC4ViQoShNAKqxpugjJSyOuWheCmyu63om1a8m_iqP-iLGxx83yARD2sGtzPyQSIVunmi8Lk"
                alt="Large profile"
                className="h-28 w-28 rounded-3xl border-4 border-surface object-cover shadow-md transition-transform duration-500 group-hover:scale-105"
              />
              <button className="absolute -bottom-3 -right-3 rounded-xl bg-primary p-2.5 text-white shadow-lg shadow-primary/20 transition-all hover:scale-110">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-on-surface leading-tight">Alex Rivera</h3>
              <p className="font-semibold text-on-surface-variant flex items-center gap-2 mt-1">
                B.Sc. Computer Science <span className="h-1 w-1 rounded-full bg-outline-variant" /> 2nd Year
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-8" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                { label: 'Full Name', value: 'Alex Rivera', type: 'text' },
                { label: 'Email', value: 'alex.rivera@university.edu', type: 'email' },
                { label: 'Phone', value: '+1 (555) 012-3456', type: 'tel' },
                { label: 'Qualification', value: "Bachelor's Degree", type: 'select' }
              ].map((field) => (
                <div key={field.label} className="space-y-2">
                  <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70">{field.label}</label>
                  {field.type === 'select' ? (
                    <select className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3.5 text-sm font-semibold transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none">
                      <option>{field.value}</option>
                    </select>
                  ) : (
                    <input 
                      type={field.type} 
                      defaultValue={field.value}
                      className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3.5 text-sm font-semibold transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <button className="rounded-xl bg-primary px-10 py-3.5 text-sm font-black uppercase tracking-widest text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-surface-tint active:scale-95">
                Save Profile
              </button>
            </div>
          </form>
        </motion.div>

        {/* Academic Performance Sidebar */}
        <aside className="space-y-8 lg:col-span-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm"
          >
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-tight text-on-surface">Academic Performance</h3>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-4">
              {academics.map((item) => (
                <div key={item.id} className="group relative flex items-center justify-between rounded-2xl bg-surface-container-low p-4 transition-all hover:bg-primary-container/10 border border-transparent hover:border-primary/20">
                  <div className="flex items-center gap-4">
                    <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", item.bg)}>
                      <item.icon className={cn("h-5 w-5", item.color)} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant leading-none">{item.label}</p>
                      <p className="mt-1 text-xs font-bold text-on-surface opacity-60 leading-none">Last Exam</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-2xl font-black tracking-tighter", item.color)}>{item.value}</p>
                    <p className="text-[8px] font-black tracking-[0.2em] leading-none mt-1 opacity-70">{item.tag}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-outline-variant pt-8 flex items-center justify-between px-2">
              <div>
                <p className="text-xl font-bold tracking-tight text-on-surface">Total Marks</p>
                <p className="text-xs font-semibold text-on-surface-variant/70 mt-1">Aggregate Score</p>
              </div>
              <div className="rounded-full bg-primary px-8 py-3 text-2xl font-black text-on-primary shadow-lg shadow-primary/20 ring-4 ring-primary/10 tracking-tighter">
                255
              </div>
            </div>
          </motion.div>

          {/* Dean's List Banner */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-primary-container p-8 text-on-primary shadow-lg"
          >
            <div className="relative z-10">
              <h4 className="flex items-center gap-2 text-lg font-bold tracking-tight">
                <Medal className="h-5 w-5 text-on-primary-container" />
                Dean's List Status
              </h4>
              <p className="mt-3 text-sm font-medium text-on-primary-container/90 leading-relaxed">
                You are currently in the top <strong className="font-black">5%</strong> of your class. Keep up the excellent work to maintain your scholarship status.
              </p>
              <button className="mt-6 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:translate-x-1 group">
                View Full Statistics
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
            <Award className="absolute -bottom-10 -right-10 h-48 w-48 text-on-primary-container/10 rotate-12" />
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
