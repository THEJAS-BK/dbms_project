import { useState, useEffect } from 'react';
import { 
  Download, 
  Search, 
  GraduationCap, 
  FileText, 
  ClipboardCheck, 
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { fetchApi } from '@/lib/api';

interface StudentRecord {
  student_id: number;
  username: string;
  full_name: string;
  level: string;
  program: string;
  gpa: number;
  status: string;
}

export default function AdminRecords() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/student-details')
      .then(data => setStudents(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Compute some basic stats
  const avgGpa = students.length > 0 ? (students.reduce((acc, s) => acc + (Number(s.gpa) || 0), 0) / students.length).toFixed(2) : '0.00';
  const goodStanding = students.filter(s => s.status === 'In Good Standing' || s.status === 'Deans List').length;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">Academic Records</h2>
          <p className="text-on-surface-variant font-medium">Verify credentials, audit transcripts, and manage student achievement data.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-surface-container-highest px-5 py-2.5 text-sm font-bold text-on-surface transition-all hover:bg-outline-variant active:scale-95">
          <Download className="h-4 w-4" />
          Bulk Export Transcripts
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Avg. Institutional GPA', value: avgGpa, icon: GraduationCap, color: 'text-primary' },
          { label: 'Good Standing', value: goodStanding, icon: FileText, color: 'text-green-600' },
          { label: 'Active Transcripts', value: students.length, icon: ClipboardCheck, color: 'text-blue-600' }
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 flex items-center justify-between shadow-sm"
          >
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">{stat.label}</p>
               <p className="text-3xl font-black text-on-surface">{stat.value}</p>
             </div>
             <stat.icon className={cn("h-8 w-8 opacity-20", stat.color)} />
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm"
      >
        <div className="flex flex-col gap-4 border-b border-surface-container px-6 py-6 lg:flex-row lg:items-center">
           <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Search by student name or student ID..." 
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low py-3 pl-10 pr-4 text-sm focus:border-primary outline-none transition-all shadow-sm"
              />
           </div>
           <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-all">
                <Filter className="h-4 w-4" />
                Enrollment Level
              </button>
              <button className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-all">
                <Filter className="h-4 w-4" />
                Department
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
           {loading ? (
             <div className="flex justify-center py-20">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
           ) : students.length === 0 ? (
             <div className="text-center py-20 text-on-surface-variant">No records found.</div>
           ) : (
             <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    {['Student Profile', 'Program of Study', 'Current GPA', 'Standing', ''].map((h, i) => (
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
                  {students.map((student) => {
                    const status = student.status || 'In Good Standing';
                    return (
                      <tr key={student.student_id} className="transition-colors hover:bg-surface-container-low/30">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container font-black text-xs text-on-surface-variant">
                                 {student.full_name ? student.full_name.split(' ').map(n=>n[0]).join('').substring(0, 2).toUpperCase() : student.username.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-on-surface leading-tight">{student.full_name || student.username}</p>
                                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1 opacity-60 tabular-nums">STU{student.student_id.toString().padStart(4, '0')}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-xs font-bold text-on-surface">{student.program || 'Undeclared'}</p>
                           <p className="text-[10px] font-semibold text-on-surface-variant mt-1">{student.level || 'Year 1'}</p>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <div className={cn(
                                "h-2 w-2 rounded-full",
                                Number(student.gpa) >= 3.5 ? "bg-green-500" :
                                Number(student.gpa) >= 3.0 ? "bg-primary" : "bg-error"
                              )} />
                              <span className="text-base font-black text-on-surface tabular-nums">{Number(student.gpa || 0).toFixed(2)}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                             {status.includes('Good') || status.includes('List') ? 
                               <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : 
                               <AlertCircle className="h-3.5 w-3.5 text-error" />
                             }
                             <span className={cn(
                               "text-[9px] font-black uppercase tracking-widest leading-none",
                               status.includes('Standing') ? "text-on-surface-variant" :
                               status.includes('Deans') ? "text-primary" : "text-error"
                             )}>
                               {status}
                             </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="inline-flex items-center gap-2 rounded-lg bg-surface-container-highest px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:bg-outline-variant transition-all">
                              Review Transcript
                              <ExternalLink className="h-3 w-3" />
                           </button>
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
