import { useNavigate } from 'react-router-dom';
import { Sprout, TrendingUp, DollarSign, Stethoscope } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const cards = [
    {
      title: 'Crop Recommendation',
      description: 'Get AI-powered crop suggestions based on your soil and climate conditions.',
      icon: Sprout,
      color: 'bg-agri-500',
      path: '/recommend',
    },
    {
      title: 'Price Forecast',
      description: 'Access market trends and future price predictions for various crops.',
      icon: TrendingUp,
      color: 'bg-sun-500',
      path: '/forecast',
    },
    {
      title: 'Profitability Analysis',
      description: 'Compare expected returns and make informed crop selection decisions.',
      icon: DollarSign,
      color: 'bg-soil-500',
      path: '/profitability',
    },
    {
      title: 'Crop Diagnosis',
      description: 'Detect plant diseases and get treatment recommendations instantly.',
      icon: Stethoscope,
      color: 'bg-agri-700',
      path: '/diagnose',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user.name || 'Farmer'}!
          </h1>
          <p className="text-xl text-gray-600">
            Choose a tool below to get started with data-driven farming decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className="card cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-2 p-6"
            >
              <div className="flex justify-center mb-4">
                <div className={`${card.color} rounded-full p-4`}>
                  <card.icon className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-agri-700 text-center mb-3">
                {card.title}
              </h3>
              <p className="text-gray-600 text-center text-sm">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Getting Started with CropAssist
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Analyze Your Soil</h3>
                <p className="text-sm text-gray-600">
                  Use the Crop Recommendation tool to input your soil parameters and get personalized crop suggestions.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Check Market Prices</h3>
                <p className="text-sm text-gray-600">
                  Review price forecasts to understand market trends and plan your crop selection accordingly.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Monitor Crop Health</h3>
                <p className="text-sm text-gray-600">
                  Use the Diagnosis tool to detect diseases early and take preventive measures to protect your crops.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
