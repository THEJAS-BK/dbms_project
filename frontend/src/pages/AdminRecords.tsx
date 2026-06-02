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
  branch: string | null;
  // These fields are null when a student hasn't filled their profile yet
  full_name: string | null;
  email: string | null;
  program: string | null;
  level: string | null;
  gpa: number | null;
  status: string | null;
}

export default function AdminRecords() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);

  useEffect(() => {
    fetchApi('/student-details')
      .then(data => setStudents(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Dynamically extract unique levels and departments from students list to ensure correctness
  const levels = ['All', ...Array.from(new Set(students.map(s => s.level).filter(Boolean)))];
  const departments = ['All', ...Array.from(new Set(students.map(s => s.program).filter(Boolean)))];

  // Filter students based on search term, selected level, and selected department
  const filteredStudents = students.filter(student => {
    const term = searchTerm.toLowerCase();
    const formattedId = `STU${student.student_id.toString().padStart(4, '0')}`.toLowerCase();
    
    const matchesSearch = 
      (student.full_name || '').toLowerCase().includes(term) ||
      (student.username || '').toLowerCase().includes(term) ||
      student.student_id.toString().includes(term) ||
      formattedId.includes(term) ||
      (student.program || '').toLowerCase().includes(term) ||
      (student.level || '').toLowerCase().includes(term);

    const matchesLevel = selectedLevel === 'All' || student.level === selectedLevel;
    const matchesDept = selectedDept === 'All' || student.program === selectedDept;

    return matchesSearch && matchesLevel && matchesDept;
  });

  // Compute some basic stats based on the filtered results
  const avgGpa = filteredStudents.length > 0 ? (filteredStudents.reduce((acc, s) => acc + (Number(s.gpa) || 0), 0) / filteredStudents.length).toFixed(2) : '0.00';
  const goodStanding = filteredStudents.filter(s => s.status === 'In Good Standing' || s.status === 'Deans List').length;

  const isFiltered = searchTerm !== '' || selectedLevel !== 'All' || selectedDept !== 'All';

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
          { label: 'Active Transcripts', value: filteredStudents.length, icon: ClipboardCheck, color: 'text-blue-600' }
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low py-3 pl-10 pr-4 text-sm focus:border-primary outline-none transition-all shadow-sm text-on-surface"
              />
           </div>
           <div className="flex items-center gap-3">
              {/* Level Filter Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setLevelDropdownOpen(!levelDropdownOpen);
                    setDeptDropdownOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer",
                    selectedLevel !== 'All' && "border-primary text-primary bg-primary/5"
                  )}
                >
                  <Filter className="h-4 w-4" />
                  <span>Level: {selectedLevel}</span>
                </button>
                {levelDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setLevelDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-outline-variant bg-surface-container-lowest p-2 shadow-lg z-20">
                      {levels.map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => {
                            setSelectedLevel(lvl);
                            setLevelDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left rounded-lg px-3 py-2 text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer",
                            selectedLevel === lvl && "bg-primary/10 text-primary"
                          )}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Department Filter Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setDeptDropdownOpen(!deptDropdownOpen);
                    setLevelDropdownOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer",
                    selectedDept !== 'All' && "border-primary text-primary bg-primary/5"
                  )}
                >
                  <Filter className="h-4 w-4" />
                  <span>Program: {selectedDept}</span>
                </button>
                {deptDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDeptDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-outline-variant bg-surface-container-lowest p-2 shadow-lg z-20">
                      {departments.map((dept) => (
                        <button
                          key={dept}
                          onClick={() => {
                            setSelectedDept(dept);
                            setDeptDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left rounded-lg px-3 py-2 text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer",
                            selectedDept === dept && "bg-primary/10 text-primary"
                          )}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {isFiltered && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLevel('All');
                    setSelectedDept('All');
                  }}
                  className="text-xs font-bold text-primary hover:underline px-2 transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
           </div>
        </div>

        <div className="overflow-x-auto">
           {loading ? (
             <div className="flex justify-center py-20">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
           ) : filteredStudents.length === 0 ? (
             <div className="text-center py-20 text-on-surface-variant">No matching records found.</div>
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
                  {filteredStudents.map((student) => {
                    const hasProfile = student.full_name !== null;
                    const status = student.status;
                    const displayProgram = student.program || (student.branch ? `${student.branch} (Branch)` : 'Undeclared');
                    const displayLevel = student.level || '—';
                    return (
                      <tr key={student.student_id} className="transition-colors hover:bg-surface-container-low/30">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-lg font-black text-xs",
                                hasProfile ? "bg-surface-container text-on-surface-variant" : "bg-surface-container-high text-on-surface-variant/40"
                              )}>
                                 {student.full_name
                                   ? student.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                                   : student.username.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-on-surface leading-tight">
                                  {student.full_name || student.username}
                                  {!hasProfile && (
                                    <span className="ml-2 rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest bg-surface-container-highest text-on-surface-variant/60">Login Only</span>
                                  )}
                                </p>
                                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1 opacity-60 tabular-nums">STU{student.student_id.toString().padStart(4, '0')}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-xs font-bold text-on-surface">{displayProgram}</p>
                           <p className="text-[10px] font-semibold text-on-surface-variant mt-1">{displayLevel}</p>
                        </td>
                        <td className="px-8 py-6">
                           {hasProfile ? (
                             <div className="flex items-center gap-2">
                               <div className={cn(
                                 "h-2 w-2 rounded-full",
                                 Number(student.gpa) >= 3.5 ? "bg-green-500" :
                                 Number(student.gpa) >= 3.0 ? "bg-primary" : "bg-error"
                               )} />
                               <span className="text-base font-black text-on-surface tabular-nums">{Number(student.gpa).toFixed(2)}</span>
                             </div>
                           ) : (
                             <div className="flex items-center gap-2">
                               <div className="h-2 w-2 rounded-full bg-outline-variant" />
                               <span className="text-sm font-black text-on-surface-variant/40 tabular-nums">N/A</span>
                             </div>
                           )}
                        </td>
                        <td className="px-8 py-6">
                          {hasProfile && status ? (
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
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-outline-variant" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40">Profile Incomplete</span>
                            </div>
                          )}
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
