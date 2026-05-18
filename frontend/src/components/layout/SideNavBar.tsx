import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  CalendarDays, 
  GraduationCap, 
  HelpCircle, 
  Settings, 
  LogOut,
  PlusCircle,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const studentNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BookOpen, label: 'Course Catalog', path: '/catalog' },
  { icon: CalendarDays, label: 'My Schedule', path: '/schedule' },
  { icon: GraduationCap, label: 'Academic Records', path: '/records' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: HelpCircle, label: 'Support', path: '/support' },
];

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/overview' },
  { icon: BookOpen, label: 'Manage Courses', path: '/admin/courses' },
  { icon: GraduationCap, label: 'Student Records', path: '/admin/records' },
];

export default function SideNavBar() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const items = isAdmin ? adminNavItems : studentNavItems;

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface py-6 transition-colors duration-200 md:flex z-50">
      <div className="mb-10 px-6">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          {isAdmin ? 'Admin Portal' : 'Student Portal'}
        </h1>
        <p className="text-sm font-medium text-on-surface-variant">EduReg System</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary-container/10 text-primary border-r-4 border-primary" 
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-4 space-y-4">
        {!isAdmin && (
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95">
            <PlusCircle className="h-5 w-5" />
            Register Now
          </button>
        )}

        <div className="border-t border-outline-variant pt-4 space-y-1">
          <NavLink
            to="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </NavLink>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-error"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
