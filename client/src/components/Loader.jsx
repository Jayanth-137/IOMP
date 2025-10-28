import { Loader2 } from 'lucide-react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default Loader;
