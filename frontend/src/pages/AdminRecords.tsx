import { 
  Download, 
  Search, 
  GraduationCap, 
  FileText, 
  ClipboardCheck, 
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const studentRecords = [
  { id: 'STU001', name: 'John Doe', level: 'Year 2', program: 'Computer Science', gpa: '3.82', status: 'In Good Standing' },
  { id: 'STU002', name: 'Jane Smith', level: 'Year 4', program: 'Bio-Technology', gpa: '3.95', status: 'Deans List' },
  { id: 'STU003', name: 'Robert Wilson', level: 'Year 3', program: 'Business Admin', gpa: '2.45', status: 'Academic Warning' },
  { id: 'STU004', name: 'Maria Garcia', level: 'Year 1', program: 'Psychology', gpa: '3.10', status: 'In Good Standing' },
  { id: 'STU005', name: 'Alex Rivera', level: 'Year 2', program: 'Computer Science', gpa: '3.65', status: 'In Good Standing' },
];

export default function AdminRecords() {
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
          { label: 'Avg. Institutional GPA', value: '3.24', icon: GraduationCap, color: 'text-primary' },
          { label: 'Degree Completions', value: '142', icon: FileText, color: 'text-green-600' },
          { label: 'Active Transcripts', value: '1,248', icon: ClipboardCheck, color: 'text-blue-600' }
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
                {studentRecords.map((student) => (
                  <tr key={student.id} className="transition-colors hover:bg-surface-container-low/30">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container font-black text-xs text-on-surface-variant">
                             {student.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface leading-tight">{student.name}</p>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1 opacity-60 tabular-nums">{student.id}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-xs font-bold text-on-surface">{student.program}</p>
                       <p className="text-[10px] font-semibold text-on-surface-variant mt-1">{student.level}</p>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-2 w-2 rounded-full",
                            parseFloat(student.gpa) >= 3.5 ? "bg-green-500" :
                            parseFloat(student.gpa) >= 3.0 ? "bg-primary" : "bg-error"
                          )} />
                          <span className="text-base font-black text-on-surface tabular-nums">{student.gpa}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         {student.status.includes('Good') || student.status.includes('List') ? 
                           <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : 
                           <AlertCircle className="h-3.5 w-3.5 text-error" />
                         }
                         <span className={cn(
                           "text-[9px] font-black uppercase tracking-widest leading-none",
                           student.status.includes('Standing') ? "text-on-surface-variant" :
                           student.status.includes('Deans') ? "text-primary" : "text-error"
                         )}>
                           {student.status}
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
                ))}
              </tbody>
           </table>
        </div>
      </motion.div>
    </div>
  );
}
