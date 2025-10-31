import { useNavigate } from 'react-router-dom';
import { Sprout, TrendingUp, DollarSign, Stethoscope, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Landing = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  const { t } = useTranslation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: Sprout,
      titleKey: 'nav.recommend',
      descKey: 'landing.features.recommend.description',
      path: '/recommend',
    },
    {
      icon: TrendingUp,
      titleKey: 'nav.forecast',
      descKey: 'landing.features.forecast.description',
      path: '/forecast',
    },
    {
      icon: DollarSign,
      titleKey: 'nav.profitability',
      descKey: 'landing.features.profitability.description',
      path: '/profitability',
    },
    {
      icon: Stethoscope,
      titleKey: 'nav.diagnose',
      descKey: 'landing.features.diagnose.description',
      path: '/diagnose',
    },
  ];

  const handleFeatureClick = (path) => {
    navigate(path);
    // if (isAuthenticated) {
    //   navigate(path);
    // } else {
    //   navigate('/login');
    // }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Sprout className="h-20 w-20 text-green-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-4">
            {t('brand')}
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 mb-8 font-light">
            {t('landing.hero.subtitle')}
          </p>
          <button
            onClick={handleGetStarted}
            className="btn-primary px-10 py-4"
          >
            {t('landing.hero.getStarted')}
          </button>
        </div>

        <div className="mb-16">
          <div className="card rounded-2xl md:p-12 p-8">
            <div className="flex items-center justify-center mb-6">
              <BarChart3 className="h-12 w-12 text-green-600 mr-4" />
              <h2 className="text-3xl font-bold text-gray-800">
                Smart Farming Solutions
              </h2>
            </div>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
              CropAssist combines advanced analytics, machine learning, and real-time data
              to help farmers make better decisions, increase yields, and improve profitability.
              Our platform provides actionable insights tailored to your farm's unique conditions.
            </p>
          </div>
        </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => handleFeatureClick(feature.path)}
              className="card hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer p-6"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-4">
                  <feature.icon className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-3">
                {t(feature.titleKey)}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {t(feature.descKey)}
              </p>
              <div className="text-center">
                <span className="text-green-600 font-semibold text-sm hover:underline">
                  Learn More →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
