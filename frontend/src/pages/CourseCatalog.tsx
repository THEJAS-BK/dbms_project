import { 
  Search, 
  Filter, 
  SortDesc as Sort, 
  CreditCard, 
  CheckCircle,
  Menu
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const categories = [
  'All Courses', 
  'Computer Science', 
  'Mathematics', 
  'Physics', 
  'Business', 
  'Humanities'
];

const catalogCourses = [
  {
    code: 'MATH402',
    name: 'Advanced Mathematics',
    credits: '4 Credits',
    description: 'Detailed exploration of calculus, linear algebra, and differential equations with focus on real-world engineering applications.',
    status: 'Open',
    seats: '12/40 Seats left',
    isRegistered: true,
  },
  {
    code: 'CS201',
    name: 'Data Structures & Algos',
    credits: '3 Credits',
    description: 'In-depth study of fundamental data structures and algorithmic complexity. Essential for software engineering career paths.',
    status: 'Open',
    seats: '5/60 Seats left',
    isRegistered: false,
  },
  {
    code: 'PHYS105',
    name: 'Quantum Mechanics I',
    credits: '4 Credits',
    description: 'Introduction to the wave mechanics of particles, Schrodinger equation, and atomic structure fundamentals.',
    status: 'Waitlist',
    seats: '0/25 Seats left',
    isRegistered: false,
  },
  {
    code: 'BUS330',
    name: 'Strategic Marketing',
    credits: '3 Credits',
    description: 'Case-study based approach to market analysis, consumer behavior, and brand positioning in global markets.',
    status: 'Open',
    seats: '34/50 Seats left',
    isRegistered: false,
  },
  {
    code: 'ART102',
    name: 'History of Digital Art',
    credits: '2 Credits',
    description: 'From early computer graphics to modern NFT culture and interactive media installations.',
    status: 'Open',
    seats: '18/30 Seats left',
    isRegistered: true,
  },
  {
    code: 'ENG405',
    name: 'Academic Writing II',
    credits: '4 Credits',
    description: 'Advanced composition focusing on research methodology, peer review processes, and thesis development.',
    status: 'Open',
    seats: '8/20 Seats left',
    isRegistered: false,
  }
];

export default function CourseCatalog() {
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

      {/* Course Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {catalogCourses.map((course, i) => (
          <motion.div
            key={course.code}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group flex flex-col rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)]"
          >
            <div className="mb-6 flex items-start justify-between">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary tracking-wide">
                {course.code}
              </span>
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <CreditCard className="h-4 w-4" />
                <span className="text-xs font-bold">{course.credits}</span>
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
                  course.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-error-container text-error'
                )}>
                  {course.status}
                </span>
                <span className="text-xs font-bold text-on-surface-variant">
                  • {course.seats}
                </span>
              </div>

              {course.isRegistered ? (
                <button 
                  disabled
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-surface-container-highest py-3 text-sm font-bold text-on-surface-variant cursor-not-allowed transition-all"
                >
                  <CheckCircle className="h-4 w-4" />
                  Registered
                </button>
              ) : (
                <button className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary-container active:scale-95">
                  Register
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Pagination */}
      <div className="flex justify-center pt-10 pb-4">
        <button className="rounded-xl border border-outline-variant bg-surface-container-lowest px-12 py-3 text-sm font-bold text-on-surface transition-all hover:bg-surface-container-high shadow-sm shadow-black/5 active:scale-95">
          Load More Courses
        </button>
      </div>
    </div>
  );
}
