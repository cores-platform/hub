import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      <Outlet />
    </div>
  );
}
