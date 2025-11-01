import { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { analysisService } from '../services/api';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import { useTranslation } from 'react-i18next';

// Encoded option lists for Price Prediction
const DISTRICTS = [
  { label: 'Karimnagar', value: 0 },
  { label: 'Khammam', value: 1 },
  { label: 'Mahbubnagar', value: 2 },
  { label: 'Medak', value: 3 },
  { label: 'Nalgonda', value: 4 },
  { label: 'Nizamabad', value: 5 },
  { label: 'Warangal', value: 6 },
];

const MARKETS = [
  { label: 'Alampur', value: 0 },
  { label: 'Badepalli', value: 1 },
  { label: 'Bhadrachalam', value: 2 },
  { label: 'Bhongir', value: 3 },
  { label: 'Burgampadu', value: 4 },
  { label: 'Charla', value: 5 },
  { label: 'Choppadandi', value: 6 },
  { label: 'Choutuppal', value: 7 },
  { label: 'Devarakadra', value: 8 },
  { label: 'Devarakonda', value: 9 },
  { label: 'Dharmaram', value: 10 },
  { label: 'Dubbak', value: 11 },
  { label: 'Gangadhara', value: 12 },
  { label: 'Ghanpur', value: 13 },
  { label: 'Husnabad', value: 14 },
  { label: 'Huzumnagar(Garidepally)', value: 15 },
  { label: 'Huzurnagar', value: 16 },
  { label: 'Huzurnagar(Matampally)', value: 17 },
  { label: 'Huzzurabad', value: 18 },
  { label: 'Jagtial', value: 19 },
  { label: 'Kallur', value: 20 },
  { label: 'Kesamudram', value: 21 },
  { label: 'Kodad', value: 22 },
  { label: 'Kodakandal', value: 23 },
  { label: 'Kollapur', value: 24 },
  { label: 'Kothagudem', value: 25 },
  { label: 'Mallial(Cheppial)', value: 26 },
  { label: 'Manakodur', value: 27 },
  { label: 'Narayanpet', value: 28 },
  { label: 'Nelakondapally', value: 29 },
  { label: 'Neredcherla', value: 30 },
  { label: 'Nidamanoor', value: 31 },
  { label: 'Nizamabad', value: 32 },
  { label: 'Pudur', value: 33 },
  { label: 'Sattupalli', value: 34 },
  { label: 'Suryapeta', value: 35 },
  { label: 'Thungathurthy', value: 36 },
  { label: 'Tirumalagiri', value: 37 },
  { label: 'Vemulawada', value: 38 },
  { label: 'Wanaparthy Road(Prbbair)', value: 39 },
  { label: 'Wyra', value: 40 },
];

const VARIETIES = [
  { label: '1001', value: 0 },
  { label: 'B P T', value: 1 },
  { label: 'Common', value: 2 },
  { label: 'HMT', value: 3 },
  { label: 'Hansa', value: 4 },
  { label: 'I.R. 64', value: 5 },
  { label: 'MTU-1010', value: 6 },
  { label: 'Other', value: 7 },
  { label: 'Paddy', value: 8 },
  { label: 'Samba Masuri', value: 9 },
  { label: 'Sona', value: 10 },
  { label: 'Swarna Masuri (New)', value: 11 },
];

const GRADES = [
  { label: 'FAQ', value: 0 },
  { label: 'Non-FAQ', value: 1 },
];

const PricePrediction = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    district: '',
    market: '',
    variety: '',
    grade: '',
    day: 1,
    month: 1,
    day_of_week: 1,
  });
  const [marketFilter, setMarketFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['district', 'market', 'variety', 'grade', 'day', 'month', 'day_of_week'];
    setFormData({
      ...formData,
      [name]: numericFields.includes(name) && value !== '' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validate required encoded selects
    if (formData.district === '' || formData.market === '' || formData.variety === '' || formData.grade === '') {
      setToast({ message: t('pricePrediction.selectRequired'), type: 'error' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
        console.log('Submitting Price Prediction with data:', formData);
      const response = await analysisService.getPricePrediction(formData);
      console.log('Price Prediction Response:', response.data.model);
      setResult(response.data.model);
      setToast({ message: t('pricePrediction.success'), type: 'success' });
    } catch (error) {
      setToast({ message: error.response?.data?.message || t('pricePrediction.failed'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filteredMarkets = MARKETS.filter((m) => m.label.toLowerCase().includes(marketFilter.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <DollarSign className="h-12 w-12 text-yellow-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('pricePrediction.title')}</h1>
          <p className="text-gray-600">{t('pricePrediction.subtitle')}</p>
        </div>

        <div className="card p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">{t('pricePrediction.fields.district')}</label>
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">— {t('pricePrediction.select')} —</option>
                  {DISTRICTS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">{t('pricePrediction.hints.district')}</p>
              </div>
              <div>
                <label htmlFor="marketFilter" className="block text-sm font-medium text-gray-700 mb-2">{t('pricePrediction.fields.market')}</label>
                <input
                  id="marketFilter"
                  placeholder={t('pricePrediction.hints.filterMarkets')}
                  value={marketFilter}
                  onChange={(e) => setMarketFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md mb-2"
                />
                <select
                  id="market"
                  name="market"
                  value={formData.market}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">— {t('pricePrediction.select')} —</option>
                  {filteredMarkets.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">{t('pricePrediction.hints.market')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="variety" className="block text-sm font-medium text-gray-700 mb-2">{t('pricePrediction.fields.variety')}</label>
                <select
                  id="variety"
                  name="variety"
                  value={formData.variety}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">— {t('pricePrediction.select')} —</option>
                  {VARIETIES.map((v) => (
                    <option key={v.value} value={v.value}>{v.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">{t('pricePrediction.hints.variety')}</p>
              </div>
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">{t('pricePrediction.fields.grade')}</label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">— {t('pricePrediction.select')} —</option>
                  {GRADES.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">{t('pricePrediction.hints.grade')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-2">{t('pricePrediction.fields.day')}</label>
                <input type="number" id="day" name="day" value={formData.day} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" min="1" max="31" />
              </div>
              <div>
                <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">{t('pricePrediction.fields.month')}</label>
                <input type="number" id="month" name="month" value={formData.month} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" min="1" max="12" />
              </div>
              <div>
                <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700 mb-2">{t('pricePrediction.fields.day_of_week')}</label>
                <input type="number" id="day_of_week" name="day_of_week" value={formData.day_of_week} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" min="1" max="7" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-accent w-full disabled:opacity-50 disabled:cursor-not-allowed">{loading ? t('pricePrediction.loading') : t('pricePrediction.submit')}</button>
          </form>
        </div>

        {loading && <Loader message={t('pricePrediction.loading')} />}

        {result && (
          <div className="space-y-6">
            <div className="card p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('pricePrediction.resultTitle')}</h3>
              <p className="text-3xl font-extrabold text-gray-900">₹{result.predicted_modal_price?.toLocaleString() || 'N/A'}</p>
              <p className="text-sm text-gray-600 mt-2">{t('pricePrediction.resultSubtitle')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricePrediction;
