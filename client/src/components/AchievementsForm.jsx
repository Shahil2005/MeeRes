import { useState } from 'react';
import { Trophy, Plus, Trash2, Calendar } from 'lucide-react';

const AchievementsForm = ({ data, onChange }) => {
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    date: ''
  });

  const handleAdd = () => {
    if (newAchievement.title) {
      onChange([...data, { ...newAchievement, id: Date.now() }]);
      setNewAchievement({
        title: '',
        description: '',
        date: ''
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
          <Trophy className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
          <p className="text-sm text-gray-500">Highlight your notable accomplishments</p>
        </div>
      </div>

      {/* Existing Achievements */}
      {data.length > 0 && (
        <div className="space-y-3">
          {data.map((achievement, index) => (
            <div key={achievement.id || index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={achievement.title}
                      onChange={(e) => handleUpdate(index, 'title', e.target.value)}
                      placeholder="Achievement Title"
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <input
                      type="text"
                      value={achievement.date}
                      onChange={(e) => handleUpdate(index, 'date', e.target.value)}
                      placeholder="Date (e.g., 2024)"
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <textarea
                    value={achievement.description}
                    onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                    placeholder="Describe your achievement..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  />
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

      {/* Add New Achievement */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Add Achievement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={newAchievement.title}
            onChange={(e) => setNewAchievement({...newAchievement, title: e.target.value})}
            placeholder="Achievement Title *"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <input
            type="text"
            value={newAchievement.date}
            onChange={(e) => setNewAchievement({...newAchievement, date: e.target.value})}
            placeholder="Date (e.g., 2024)"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <textarea
          value={newAchievement.description}
          onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
          placeholder="Describe your achievement..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
        />
        <button
          onClick={handleAdd}
          disabled={!newAchievement.title}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Achievement
        </button>
      </div>
    </div>
  );
};

export default AchievementsForm;
