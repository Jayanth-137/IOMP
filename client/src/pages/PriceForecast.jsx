import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { forecastService } from '../services/api';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PriceForecast = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  const crops = [
    'Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Potato', 'Tomato',
    'Onion', 'Banana', 'Mango', 'Apple', 'Grapes', 'Soybean', 'Groundnut'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCrop) {
      setToast({ message: 'Please select a crop', type: 'error' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await forecastService.getPriceDistribution(selectedCrop);
      setResult(response.data);
      setToast({ message: 'Price forecast loaded successfully!', type: 'success' });
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to get price forecast. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? {
    labels: result.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Minimum Price',
        data: result.min_prices || [],
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Modal Price',
        data: result.modal_prices || [],
        borderColor: 'rgba(34, 197, 94, 1)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Maximum Price',
        data: result.max_prices || [],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
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
        text: `Price Forecast for ${selectedCrop}`,
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price (₹/quintal)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
  };

  return (
  <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-white py-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2 font-heading">Price Forecast</h1>
          <p className="text-gray-600">
            View market price trends and predictions for various crops
          </p>
        </div>

  <div className="card p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="crop" className="block text-sm font-medium text-gray-700 mb-2">
                Select Crop
              </label>
              <select
                id="crop"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose a crop...</option>
                {crops.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-blue w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading Forecast...' : 'View Price Forecast'}
            </button>
          </form>
        </div>

        {loading && <Loader message="Loading price forecast..." />}

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-agri-700 mb-2 font-heading">Current Average</h3>
                <p className="text-3xl font-bold text-agri-500">
                  ₹{result.current_avg || 'N/A'}
                </p>
                <p className="text-sm text-gray-500 mt-2">per quintal</p>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-agri-700 mb-2 font-heading">Predicted Average</h3>
                <p className="text-3xl font-bold text-soil-500">
                  ₹{result.predicted_avg || 'N/A'}
                </p>
                <p className="text-sm text-gray-500 mt-2">per quintal</p>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-agri-700 mb-2 font-heading">Price Trend</h3>
                <p className={`text-3xl font-bold ${result.trend === 'up' ? 'text-agri-500' : result.trend === 'down' ? 'text-soil-500' : 'text-gray-600'}`}>
                  {result.trend === 'up' ? '↑ Rising' : result.trend === 'down' ? '↓ Falling' : '→ Stable'}
                </p>
                <p className="text-sm text-gray-500 mt-2">market outlook</p>
              </div>
            </div>

            {chartData && (
              <div className="card p-8">
                <Line data={chartData} options={chartOptions} />
              </div>
            )}

            {result.insights && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-agri-700 mb-4 font-heading">Market Insights</h2>
                <div className="prose max-w-none text-gray-700">
                  <p>{result.insights}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceForecast;
