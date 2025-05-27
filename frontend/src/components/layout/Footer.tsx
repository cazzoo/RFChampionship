import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} GamePlatform. All rights reserved.</p>
        {/* Add any other footer links or information here */}
      </div>
    </footer>
  );
};

export default Footer;
