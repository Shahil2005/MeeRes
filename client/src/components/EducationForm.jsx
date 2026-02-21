import { useState } from 'react';
import { GraduationCap, Plus, Trash2, Calendar, Building2 } from 'lucide-react';

const EducationForm = ({ data, onChange }) => {
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const handleAdd = () => {
    if (newEducation.institution && newEducation.degree) {
      onChange([...data, { ...newEducation, id: Date.now() }]);
      setNewEducation({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        description: ''
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
          <GraduationCap className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Education</h2>
          <p className="text-sm text-gray-500">Add your educational background</p>
        </div>
      </div>

      {/* Existing Education Entries */}
      {data.length > 0 && (
        <div className="space-y-4">
          {data.map((edu, index) => (
            <div key={edu.id || index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleUpdate(index, 'institution', e.target.value)}
                    placeholder="Institution Name"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleUpdate(index, 'degree', e.target.value)}
                    placeholder="Degree (e.g., Bachelor of Science)"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={(e) => handleUpdate(index, 'fieldOfStudy', e.target.value)}
                    placeholder="Field of Study"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => handleUpdate(index, 'startDate', e.target.value)}
                      placeholder="Start Date"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => handleUpdate(index, 'endDate', e.target.value)}
                      placeholder="End Date"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(index)}
                  className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={edu.description}
                onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                placeholder="Additional details (GPA, honors, relevant coursework...)"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>
          ))}
        </div>
      )}

      {/* Add New Education */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Add Education</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={newEducation.institution}
              onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
              placeholder="Institution Name *"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <input
            type="text"
            value={newEducation.degree}
            onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
            placeholder="Degree *"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <input
            type="text"
            value={newEducation.fieldOfStudy}
            onChange={(e) => setNewEducation({...newEducation, fieldOfStudy: e.target.value})}
            placeholder="Field of Study"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newEducation.startDate}
              onChange={(e) => setNewEducation({...newEducation, startDate: e.target.value})}
              placeholder="Start Date"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <input
              type="text"
              value={newEducation.endDate}
              onChange={(e) => setNewEducation({...newEducation, endDate: e.target.value})}
              placeholder="End Date"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        <textarea
          value={newEducation.description}
          onChange={(e) => setNewEducation({...newEducation, description: e.target.value})}
          placeholder="Additional details (GPA, honors, relevant coursework...)"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
        />
        <button
          onClick={handleAdd}
          disabled={!newEducation.institution || !newEducation.degree}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>
    </div>
  );
};

export default EducationForm;
