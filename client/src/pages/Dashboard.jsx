import { useNavigate } from 'react-router-dom';
import { Sprout, TrendingUp, DollarSign, Stethoscope } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { t } = useTranslation();

  const cards = [
    {
      title: t('nav.recommend'),
      description: t('dashboard.cards.recommend.description'),
      icon: Sprout,
      color: 'bg-agri-500',
      path: '/recommend',
    },
    {
      title: t('nav.forecast'),
      description: t('dashboard.cards.forecast.description'),
      icon: TrendingUp,
      color: 'bg-sun-500',
      path: '/forecast',
    },
    {
      title: t('nav.pricePrediction'),
      description: t('dashboard.cards.pricePrediction.description'),
      icon: DollarSign,
      color: 'bg-soil-500',
      path: '/price-prediction',
    },
    {
      title: t('nav.diagnose'),
      description: t('dashboard.cards.diagnose.description'),
      icon: Stethoscope,
      color: 'bg-agri-700',
      path: '/diagnose',
    },
  ];
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {t('dashboard.welcome', { name: user.name || t('dashboard.anonymous') })}
          </h1>
          <p className="text-xl text-gray-600">
            {t('dashboard.subtitle')}
          </p>
        </div>
        

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => navigate(feature.path)}
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
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t('dashboard.gettingStarted.title')}
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t('dashboard.steps.analyze.title')}</h3>
                <p className="text-sm text-gray-600">{t('dashboard.steps.analyze.description')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t('dashboard.steps.market.title')}</h3>
                <p className="text-sm text-gray-600">{t('dashboard.steps.market.description')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t('dashboard.steps.monitor.title')}</h3>
                <p className="text-sm text-gray-600">{t('dashboard.steps.monitor.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
