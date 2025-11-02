
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center mt-8 pb-4">
      <p className="text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Pooper Scooper Inc. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
