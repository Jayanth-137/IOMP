import { Sprout } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-agri-700 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Sprout className="h-6 w-6 text-agri-50" />
            <span className="text-xl font-bold font-heading">CropAssist</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-agri-50 font-heading">
              Empowering Farmers with Data-Driven Decisions
            </p>
            <p className="text-xs text-agri-100 mt-2">
              &copy; {new Date().getFullYear()} CropAssist. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
