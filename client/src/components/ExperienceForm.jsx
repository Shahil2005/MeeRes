import { useState } from 'react';
import { Briefcase, Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { aiAPI } from '../services/api';

const ExperienceForm = ({ data, onChange }) => {
  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    bullets: ['']
  });
  const [enhancingIndex, setEnhancingIndex] = useState(null);
  const [newBulletText, setNewBulletText] = useState('');

  const handleAdd = () => {
    if (newExperience.company && newExperience.position) {
      const filteredBullets = newExperience.bullets.filter(b => b.trim() !== '');
      onChange([...data, { 
        ...newExperience, 
        bullets: filteredBullets.length > 0 ? filteredBullets : [''],
        id: Date.now() 
      }]);
      setNewExperience({
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        bullets: ['']
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

  const handleAddBullet = (expIndex) => {
    if (newBulletText.trim()) {
      const updated = data.map((item, i) => 
        i === expIndex 
          ? { ...item, bullets: [...item.bullets, newBulletText.trim()] }
          : item
      );
      onChange(updated);
      setNewBulletText('');
    }
  };

  const handleUpdateBullet = (expIndex, bulletIndex, value) => {
    const updated = data.map((item, i) => 
      i === expIndex 
        ? { 
            ...item, 
            bullets: item.bullets.map((b, bi) => bi === bulletIndex ? value : b)
          }
        : item
    );
    onChange(updated);
  };

  const handleRemoveBullet = (expIndex, bulletIndex) => {
    const updated = data.map((item, i) => 
      i === expIndex 
        ? { ...item, bullets: item.bullets.filter((_, bi) => bi !== bulletIndex) }
        : item
    );
    onChange(updated);
  };

  const handleEnhanceBullet = async (expIndex, bulletIndex) => {
    const bulletText = data[expIndex].bullets[bulletIndex];
    if (!bulletText.trim()) return;

    setEnhancingIndex(`${expIndex}-${bulletIndex}`);
    try {
      const response = await aiAPI.enhanceBullet(bulletText);
      if (response.success) {
        handleUpdateBullet(expIndex, bulletIndex, response.enhancedText);
      }
    } catch (error) {
      console.error('Failed to enhance bullet:', error);
      alert('Failed to enhance text. Please check your Groq API configuration.');
    } finally {
      setEnhancingIndex(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
          <p className="text-sm text-gray-500">Add your professional experience with AI-enhanced bullets</p>
        </div>
      </div>

      {/* Existing Experience Entries */}
      {data.length > 0 && (
        <div className="space-y-4">
          {data.map((exp, expIndex) => (
            <div key={exp.id || expIndex} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleUpdate(expIndex, 'company', e.target.value)}
                    placeholder="Company Name"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => handleUpdate(expIndex, 'position', e.target.value)}
                    placeholder="Job Title"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => handleUpdate(expIndex, 'location', e.target.value)}
                    placeholder="Location"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => handleUpdate(expIndex, 'startDate', e.target.value)}
                      placeholder="Start Date"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => handleUpdate(expIndex, 'endDate', e.target.value)}
                      placeholder="End Date"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(expIndex)}
                  className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bullets */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Accomplishments</label>
                {exp.bullets.map((bullet, bulletIndex) => (
                  <div key={bulletIndex} className="flex gap-2">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">•</span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(expIndex, bulletIndex, e.target.value)}
                        placeholder="Describe your accomplishment..."
                        className="w-full pl-8 pr-20 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <button
                        onClick={() => handleEnhanceBullet(expIndex, bulletIndex)}
                        disabled={enhancingIndex === `${expIndex}-${bulletIndex}` || !bullet.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {enhancingIndex === `${expIndex}-${bulletIndex}` ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        AI
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveBullet(expIndex, bulletIndex)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Experience */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Add Experience</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={newExperience.company}
            onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
            placeholder="Company Name *"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <input
            type="text"
            value={newExperience.position}
            onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
            placeholder="Job Title *"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <input
            type="text"
            value={newExperience.location}
            onChange={(e) => setNewExperience({...newExperience, location: e.target.value})}
            placeholder="Location"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newExperience.startDate}
              onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})}
              placeholder="Start Date"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <input
              type="text"
              value={newExperience.endDate}
              onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})}
              placeholder="End Date"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          disabled={!newExperience.company || !newExperience.position}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>
    </div>
  );
};

export default ExperienceForm;
