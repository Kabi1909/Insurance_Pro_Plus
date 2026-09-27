import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Shield className="h-16 w-16 text-primary mb-6" />
      <h1 className="text-6xl font-bold text-textMain mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-textSecondary mb-8 text-center">Oops! We can't find that page.</h2>
      <p className="text-textSecondary mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-primary-dark transition-colors">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
