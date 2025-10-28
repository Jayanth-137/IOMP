import { useState } from 'react';
import { Stethoscope, Upload, Image as ImageIcon } from 'lucide-react';
import { diagnoseService } from '../services/api';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

const Diagnosis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setToast({ message: 'Please select an image', type: 'error' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      if (question) {
        formData.append('question', question);
      }

      const response = await diagnoseService.uploadImage(formData);
      setResult(response.data);
      setToast({ message: 'Diagnosis completed successfully!', type: 'success' });
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Failed to diagnose. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setQuestion('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Stethoscope className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Crop Diagnosis</h1>
          <p className="text-gray-600">
            Upload a photo of your crop to detect diseases and get treatment recommendations
          </p>
        </div>

  <div className="card p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Crop Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-agri-200 border-dashed rounded-lg hover:border-agri-500 transition-colors">
                <div className="space-y-1 text-center">
                  {previewUrl ? (
                    <div className="mb-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="mx-auto h-48 w-auto rounded-lg shadow-md"
                      />
                    </div>
                  ) : (
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-700 focus-within:outline-none"
                    >
                      <span>{previewUrl ? 'Change image' : 'Upload a file'}</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Question (Optional)
              </label>
              <textarea
                id="question"
                name="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Describe any specific symptoms or concerns..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading || !selectedFile}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Analyzing...' : 'Diagnose'}
              </button>
              {(selectedFile || result) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg shadow-md transition-all"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {loading && <Loader message="Analyzing crop image..." />}

        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Diagnosis Results</h2>

              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Detected Disease</h3>
                  <p className="text-xl font-bold text-red-700">
                    {result.disease || result.detected_disease || 'Unknown'}
                  </p>
                  {result.confidence && (
                    <p className="text-sm text-gray-600 mt-1">
                      Confidence: {(result.confidence * 100).toFixed(1)}%
                    </p>
                  )}
                </div>

                {result.description && (
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-700">{result.description}</p>
                  </div>
                )}

                {result.symptoms && result.symptoms.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Symptoms</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {result.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.treatment && (
                  <div className="bg-green-50 p-4 rounded">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Treatment Recommendations</h3>
                    {typeof result.treatment === 'string' ? (
                      <p className="text-gray-700">{result.treatment}</p>
                    ) : (
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {result.treatment.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {result.prevention && (
                  <div className="bg-blue-50 p-4 rounded">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Prevention Tips</h3>
                    {typeof result.prevention === 'string' ? (
                      <p className="text-gray-700">{result.prevention}</p>
                    ) : (
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {result.prevention.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diagnosis;
