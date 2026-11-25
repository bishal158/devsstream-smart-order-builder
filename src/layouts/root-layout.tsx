import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm shadow-primary/25">
              DS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">DevsStream Limited</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-light text-primary font-medium">
                  Assessment
                </span>
              </div>
              <p className="text-xs text-text-muted">Smart Order Builder · Frontend Engineering</p>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-text-main hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary-light/50"
            >
              Order Builder
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-4 text-center text-xs text-text-muted">
        <p>DevsStream Limited Assessment · Built with React 19, TypeScript & Tailwind CSS</p>
      </footer>
    </div>
  );
};
