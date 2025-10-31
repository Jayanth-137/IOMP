import { useState } from 'react';
import { Sprout } from 'lucide-react';
import { recommendService } from '../services/api';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await recommendService.getCropSuitability(formData);
      setResult(response.data);
  setToast({ message: t('recommendation.success'), type: 'success' });
    } catch (error) {
      setToast({
        message: error.response?.data?.message || t('recommendation.failed'),
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? {
    labels: result.crops?.map(crop => crop.name) || [],
    datasets: [
      {
        label: 'Suitability Score',
        data: result.crops?.map(crop => crop.score) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Crop Suitability Analysis',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Sprout className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('recommendation.title')}</h1>
          <p className="text-gray-600">{t('recommendation.subtitle')}</p>
        </div>

  <div className="card p-8 mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="N" className="block text-sm font-medium text-gray-700 mb-2">
                {t('recommendation.form.N.label')}
              </label>
              <input
                type="number"
                id="N"
                name="N"
                value={formData.N}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('recommendation.form.N.placeholder')}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="P" className="block text-sm font-medium text-gray-700 mb-2">
                {t('recommendation.form.P.label')}
              </label>
              <input
                type="number"
                id="P"
                name="P"
                value={formData.P}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('recommendation.form.P.placeholder')}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="K" className="block text-sm font-medium text-gray-700 mb-2">
                {t('recommendation.form.K.label')}
              </label>
              <input
                type="number"
                id="K"
                name="K"
                value={formData.K}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('recommendation.form.K.placeholder')}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
                {t('recommendation.form.temperature.label')}
              </label>
              <input
                type="number"
                id="temperature"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('recommendation.form.temperature.placeholder')}
                required
                min="-50"
                max="60"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="humidity" className="block text-sm font-medium text-gray-700 mb-2">
                {t('recommendation.form.humidity.label')}
              </label>
              <input
                type="number"
                id="humidity"
                name="humidity"
                value={formData.humidity}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('recommendation.form.humidity.placeholder')}
                required
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="ph" className="block text-sm font-medium text-gray-700 mb-2">
                {t('recommendation.form.ph.label')}
              </label>
              <input
                type="number"
                id="ph"
                name="ph"
                value={formData.ph}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('recommendation.form.ph.placeholder')}
                required
                min="0"
                max="14"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="rainfall" className="block text-sm font-medium text-gray-700 mb-2">
                {t('recommendation.form.rainfall.label')}
              </label>
              <input
                type="number"
                id="rainfall"
                name="rainfall"
                value={formData.rainfall}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder={t('recommendation.form.rainfall.placeholder')}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('recommendation.loading') : t('recommendation.submit')}
              </button>
            </div>
          </form>
        </div>

        {loading && <Loader message="Analyzing soil conditions..." />}

        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommended Crop</h2>
              <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
                <p className="text-3xl font-bold text-green-800 mb-2">
                  {result.recommended_crop || result.crop}
                </p>
                <p className="text-gray-700">
                  {result.description || 'This crop is best suited for your soil and climate conditions.'}
                </p>
              </div>
            </div>

            {chartData && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <Bar data={chartData} options={chartOptions} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendation;
