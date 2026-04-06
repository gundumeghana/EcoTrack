import React from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { DataProvider } from '../context/DataContext';
import { Toaster } from '../components/ui/sonner';
import { LayoutDashboard, Users } from 'lucide-react';

export const RootLayout: React.FC = () => {
  const location = useLocation();

  return (
    <DataProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="bg-white border-b-2 border-green-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">♻️</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">EcoTrack</h1>
                  <p className="text-xs text-gray-600">Plastic Waste Tracking</p>
                </div>
              </div>

              <nav className="flex items-center gap-2">
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    location.pathname === '/'
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="font-medium">Admin Dashboard</span>
                </Link>
                <Link
                  to="/collector"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    location.pathname === '/collector'
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Collector View</span>
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>

        <Toaster />
      </div>
    </DataProvider>
  );
};