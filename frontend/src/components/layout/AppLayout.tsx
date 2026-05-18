import { Outlet } from 'react-router-dom';
import SideNavBar from './SideNavBar';
import TopNavBar from './TopNavBar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <SideNavBar />
      <TopNavBar />
      <main className="transition-all duration-300 md:ml-64 pt-16 min-h-screen">
        <div className="mx-auto max-w-[1440px] p-6 md:p-10">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile Navigation Placeholder (Bottom Nav could be added here for mobile view) */}
    </div>
  );
}
