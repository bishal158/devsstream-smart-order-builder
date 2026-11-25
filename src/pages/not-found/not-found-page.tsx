import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center text-primary font-bold text-2xl mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold text-text-main tracking-tight">Page Not Found</h1>
      <p className="text-sm text-text-muted mt-2 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover transition-colors shadow-sm"
      >
        Back to Order Builder
      </Link>
    </div>
  );
};
