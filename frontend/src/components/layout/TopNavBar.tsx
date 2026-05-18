import { Bell, Search, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function TopNavBar() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <header className="fixed top-0 right-0 z-40 w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant md:w-[calc(100%-16rem)] h-16 transition-all duration-200 shadow-sm">
      <div className="flex h-full max-w-[1440px] items-center justify-between px-8 mx-auto">
        <div className="flex flex-1 items-center gap-8">
          <span className="text-xl font-black text-primary md:hidden lg:inline-block">EduReg System</span>
          
          <div className="relative hidden w-full max-w-md sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search academic resources..."
              className="w-full rounded-full border-none bg-surface-container-low py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-shadow"
            />
          </div>
        </div>

        <nav className="flex items-center gap-8">
          <div className="hidden items-center gap-6 lg:flex">
            {!isAdmin && ['Overview', 'Messages', 'Reports'].map((item) => (
              <NavLink
                key={item}
                to={`/${item.toLowerCase()}`}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-semibold transition-all duration-200 pb-1 border-b-2",
                    isActive ? "text-primary border-primary" : "text-on-surface-variant border-transparent hover:text-primary"
                  )
                }
              >
                {item}
              </NavLink>
            ))}
            {isAdmin && ['Overview', 'Courses', 'Records'].map((item) => (
              <NavLink
                key={item}
                to={`/admin/${item.toLowerCase()}`}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-semibold transition-all duration-200 pb-1 border-b-2",
                    isActive ? "text-primary border-primary" : "text-on-surface-variant border-transparent hover:text-primary"
                  )
                }
              >
                {item}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-4 border-l border-outline-variant pl-6">
            <button className="relative rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-error"></span>
            </button>
            <button className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3 pl-2 border-l border-outline-variant">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-on-surface leading-tight">{user?.username || 'Guest'}</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-tight">
                  {isAdmin ? 'Administrator' : 'Student'}
                </p>
              </div>
              <img
                src={isAdmin 
                  ? "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
                  : "https://lh3.googleusercontent.com/aida-public/AB6AXuBHlchsIN1uPCo9Im361wDPyUZMUvej1IcUyBYefZvICWYf1Hqa4m6rPCPb-ygkuG6XLMAi99LpaIzuofoQOlyP4JQpKLQTkmzk1V7UVUlVHfEzqZdGvVhtbbVKDRe9-BeVygC1jTXRMZAgA1e7SFqH_5v-9cqRZ2Gu0hkcyodaTrFrs-rd-Iq3myS6d1VigrTzP7B30XUHOzkld2Y_dDwniwwaMpn2zcud1V5b_3hS4bWhA69M4O19in7htX_Wx9gSa8BkV7u4Pro"
                }
                alt="Profile"
                className="h-9 w-9 rounded-full border-2 border-primary-container object-cover"
              />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
