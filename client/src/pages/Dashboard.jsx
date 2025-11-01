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
