import { useState } from 'react';
import { Award, Plus, Trash2, Link2, Calendar } from 'lucide-react';

const CertificationsForm = ({ data, onChange }) => {
  const [newCert, setNewCert] = useState({
    name: '',
    issuer: '',
    date: '',
    link: ''
  });

  const handleAdd = () => {
    if (newCert.name) {
      onChange([...data, { ...newCert, id: Date.now() }]);
      setNewCert({
        name: '',
        issuer: '',
        date: '',
        link: ''
      });
    }
  };

  const handleRemove = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleUpdate = (index, field, value) => {
    const updated = data.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Award className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Certifications</h2>
          <p className="text-sm text-gray-500">Add your professional certifications</p>
        </div>
      </div>

      {/* Existing Certifications */}
      {data.length > 0 && (
        <div className="space-y-3">
          {data.map((cert, index) => (
            <div key={cert.id || index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                    placeholder="Certification Name"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => handleUpdate(index, 'issuer', e.target.value)}
                    placeholder="Issuing Organization"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <input
                    type="text"
                    value={cert.date}
                    onChange={(e) => handleUpdate(index, 'date', e.target.value)}
                    placeholder="Date (e.g., Jan 2024)"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={cert.link}
                      onChange={(e) => handleUpdate(index, 'link', e.target.value)}
                      placeholder="Credential URL"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Certification */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Add Certification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={newCert.name}
            onChange={(e) => setNewCert({...newCert, name: e.target.value})}
            placeholder="Certification Name *"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <input
            type="text"
            value={newCert.issuer}
            onChange={(e) => setNewCert({...newCert, issuer: e.target.value})}
            placeholder="Issuing Organization"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <input
            type="text"
            value={newCert.date}
            onChange={(e) => setNewCert({...newCert, date: e.target.value})}
            placeholder="Date (e.g., Jan 2024)"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="url"
              value={newCert.link}
              onChange={(e) => setNewCert({...newCert, link: e.target.value})}
              placeholder="Credential URL"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          disabled={!newCert.name}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>
    </div>
  );
};

export default CertificationsForm;
