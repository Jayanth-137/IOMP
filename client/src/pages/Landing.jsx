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
      // recommend uses agri (green)
      color: {
        pillBg: 'bg-agri-100',
        icon: 'text-agri-600',
        title: 'text-agri-700',
        link: 'text-agri-600 hover:text-agri-800',
        accent: 'bg-agri-600',
      },
    },
    {
      icon: TrendingUp,
      titleKey: 'nav.forecast',
      descKey: 'landing.features.forecast.description',
      path: '/forecast',
      // forecast uses blue
      color: {
        pillBg: 'bg-blue-50',
        icon: 'text-blue-600',
        title: 'text-blue-700',
        link: 'text-blue-600 hover:text-blue-800',
        accent: 'bg-blue-600',
      },
    },
    {
      icon: DollarSign,
      titleKey: 'nav.pricePrediction',
      descKey: 'landing.features.pricePrediction.description',
      path: '/price-prediction',
      // price prediction uses soil (brown)
      color: {
        pillBg: 'bg-soil-100',
        icon: 'text-soil-600',
        title: 'text-soil-700',
        link: 'text-soil-600 hover:text-soil-800',
        accent: 'bg-soil-600',
      },
    },
    {
      icon: Stethoscope,
      titleKey: 'nav.diagnose',
      descKey: 'landing.features.diagnose.description',
      path: '/diagnose',
      // diagnose uses red (alert/diagnosis)
      color: {
        pillBg: 'bg-red-100',
        icon: 'text-red-600',
        title: 'text-red-700',
        link: 'text-red-600 hover:text-red-800',
        accent: 'bg-red-600',
      },
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
                className="card relative hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer p-6"
              >
                {/* top accent bar */}
                <div className={`${feature.color.accent} absolute left-0 right-0 top-0 h-1 rounded-t-xl`} />
                <div className="flex justify-center mb-4">
                  <div className={`${feature.color.pillBg} rounded-full p-4`}>
                    <feature.icon className={`h-8 w-8 ${feature.color.icon}`} />
                  </div>
                </div>
              <h3 className={`text-xl font-bold ${feature.color.title} text-center mb-3`}>
                {t(feature.titleKey)}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {t(feature.descKey)}
              </p>
                <div className="text-center">
                  <span className={`${feature.color.link} font-semibold text-sm`}>
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
