// app/dashboard/layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';
import { Code } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Header/Navbar */}
      <header className="bg-gray-900 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Code className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-lg text-white">LeetCode Dashboard</span>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link href="/leaderboard" className="text-gray-400 hover:text-white">
              Dashboard
            </Link>
           
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="py-6        dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] -z-10",
        )}
      />
      
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Made by Vaibhav. All rights reserved.
        </div>
      </footer>
    </div>
  );
}