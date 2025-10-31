import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { analysisService } from '../services/api';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import { useTranslation } from 'react-i18next';

const Profitability = () => {
  const [formData, setFormData] = useState({
    user_crop: '',
    land_size: '',
    investment: '',
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
      const response = await analysisService.getProfitability(formData);
      setResult(response.data);
      setToast({ message: t('profitability.success'), type: 'success' });
    } catch (error) {
      setToast({
        message: error.response?.data?.message || t('profitability.failed'),
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <DollarSign className="h-12 w-12 text-yellow-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('profitability.title')}</h1>
          <p className="text-gray-600">{t('profitability.subtitle')}</p>
        </div>

  <div className="card p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="user_crop" className="block text-sm font-medium text-gray-700 mb-2">
                Your Chosen Crop
              </label>
              <input
                type="text"
                id="user_crop"
                name="user_crop"
                value={formData.user_crop}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="e.g., Rice, Wheat, Cotton"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="land_size" className="block text-sm font-medium text-gray-700 mb-2">
                  Land Size (acres)
                </label>
                <input
                  type="number"
                  id="land_size"
                  name="land_size"
                  value={formData.land_size}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="e.g., 5"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label htmlFor="investment" className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Budget (₹)
                </label>
                <input
                  type="number"
                  id="investment"
                  name="investment"
                  value={formData.investment}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="e.g., 100000"
                  required
                  min="0"
                  step="1"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-accent w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze Profitability'}
            </button>
          </form>
        </div>

        {loading && <Loader message="Calculating profitability..." />}

        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metric
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Your Crop ({result.user_crop})
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recommended ({result.recommended_crop})
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Difference
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Expected Revenue
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{result.user_revenue?.toLocaleString() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{result.recommended_revenue?.toLocaleString() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {result.revenue_diff > 0 ? (
                          <span className="flex items-center text-green-600 font-semibold">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            +₹{result.revenue_diff.toLocaleString()}
                          </span>
                        ) : result.revenue_diff < 0 ? (
                          <span className="flex items-center text-red-600 font-semibold">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            ₹{result.revenue_diff.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Production Cost
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{result.user_cost?.toLocaleString() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{result.recommended_cost?.toLocaleString() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {result.cost_diff < 0 ? (
                          <span className="flex items-center text-green-600 font-semibold">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            ₹{Math.abs(result.cost_diff).toLocaleString()} saved
                          </span>
                        ) : result.cost_diff > 0 ? (
                          <span className="flex items-center text-red-600 font-semibold">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            +₹{result.cost_diff.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Net Profit
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        ₹{result.user_profit?.toLocaleString() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        ₹{result.recommended_profit?.toLocaleString() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {result.profit_diff > 0 ? (
                          <span className="flex items-center text-green-600 font-bold">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            +₹{result.profit_diff.toLocaleString()}
                          </span>
                        ) : result.profit_diff < 0 ? (
                          <span className="flex items-center text-red-600 font-bold">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            ₹{result.profit_diff.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-600 font-bold">-</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ROI (%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.user_roi?.toFixed(2) || 'N/A'}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.recommended_roi?.toFixed(2) || 'N/A'}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {result.roi_diff > 0 ? (
                          <span className="flex items-center text-green-600 font-semibold">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            +{result.roi_diff.toFixed(2)}%
                          </span>
                        ) : result.roi_diff < 0 ? (
                          <span className="flex items-center text-red-600 font-semibold">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            {result.roi_diff.toFixed(2)}%
                          </span>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {result.recommendation && (
              <div className={`rounded-xl shadow-lg p-6 ${result.profit_diff > 0 ? 'bg-green-50 border-l-4 border-green-600' : 'bg-yellow-50 border-l-4 border-yellow-600'}`}>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Recommendation</h3>
                <p className="text-gray-700">{result.recommendation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profitability;
