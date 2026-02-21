import { useState } from 'react';
import { FolderGit, Plus, Trash2, Sparkles, Loader2, Link2 } from 'lucide-react';
import { aiAPI } from '../services/api';

const ProjectsForm = ({ data, onChange }) => {
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    link: '',
    bullets: ['']
  });
  const [enhancingIndex, setEnhancingIndex] = useState(null);

  const handleAdd = () => {
    if (newProject.title) {
      const filteredBullets = newProject.bullets.filter(b => b.trim() !== '');
      onChange([...data, { 
        ...newProject, 
        technologies: newProject.technologies.split(',').map(t => t.trim()).filter(Boolean),
        bullets: filteredBullets.length > 0 ? filteredBullets : [''],
        id: Date.now() 
      }]);
      setNewProject({
        title: '',
        description: '',
        technologies: '',
        link: '',
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

  const handleUpdateTechnologies = (index, value) => {
    const techs = value.split(',').map(t => t.trim()).filter(Boolean);
    handleUpdate(index, 'technologies', techs);
  };

  const handleAddBullet = (projIndex, bulletText) => {
    if (bulletText.trim()) {
      const updated = data.map((item, i) => 
        i === projIndex 
          ? { ...item, bullets: [...item.bullets, bulletText.trim()] }
          : item
      );
      onChange(updated);
    }
  };

  const handleUpdateBullet = (projIndex, bulletIndex, value) => {
    const updated = data.map((item, i) => 
      i === projIndex 
        ? { 
            ...item, 
            bullets: item.bullets.map((b, bi) => bi === bulletIndex ? value : b)
          }
        : item
    );
    onChange(updated);
  };

  const handleRemoveBullet = (projIndex, bulletIndex) => {
    const updated = data.map((item, i) => 
      i === projIndex 
        ? { ...item, bullets: item.bullets.filter((_, bi) => bi !== bulletIndex) }
        : item
    );
    onChange(updated);
  };

  const handleEnhanceBullet = async (projIndex, bulletIndex) => {
    const bulletText = data[projIndex].bullets[bulletIndex];
    if (!bulletText.trim()) return;

    setEnhancingIndex(`${projIndex}-${bulletIndex}`);
    try {
      const response = await aiAPI.enhanceBullet(bulletText);
      if (response.success) {
        handleUpdateBullet(projIndex, bulletIndex, response.enhancedText);
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
          <FolderGit className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
          <p className="text-sm text-gray-500">Showcase your projects with AI-enhanced descriptions</p>
        </div>
      </div>

      {/* Existing Projects */}
      {data.length > 0 && (
        <div className="space-y-4">
          {data.map((proj, projIndex) => (
            <div key={proj.id || projIndex} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => handleUpdate(projIndex, 'title', e.target.value)}
                    placeholder="Project Title"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={proj.link}
                      onChange={(e) => handleUpdate(projIndex, 'link', e.target.value)}
                      placeholder="Project Link"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <input
                    type="text"
                    value={Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                    onChange={(e) => handleUpdateTechnologies(projIndex, e.target.value)}
                    placeholder="Technologies (comma separated)"
                    className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <button
                  onClick={() => handleRemove(projIndex)}
                  className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <textarea
                value={proj.description}
                onChange={(e) => handleUpdate(projIndex, 'description', e.target.value)}
                placeholder="Brief project description..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />

              {/* Bullets */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Key Features / Accomplishments</label>
                {proj.bullets.map((bullet, bulletIndex) => (
                  <div key={bulletIndex} className="flex gap-2">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">•</span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(projIndex, bulletIndex, e.target.value)}
                        placeholder="Describe a feature or accomplishment..."
                        className="w-full pl-8 pr-20 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <button
                        onClick={() => handleEnhanceBullet(projIndex, bulletIndex)}
                        disabled={enhancingIndex === `${projIndex}-${bulletIndex}` || !bullet.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {enhancingIndex === `${projIndex}-${bulletIndex}` ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        AI
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveBullet(projIndex, bulletIndex)}
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

      {/* Add New Project */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Add Project</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={newProject.title}
            onChange={(e) => setNewProject({...newProject, title: e.target.value})}
            placeholder="Project Title *"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="url"
              value={newProject.link}
              onChange={(e) => setNewProject({...newProject, link: e.target.value})}
              placeholder="Project Link"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <input
            type="text"
            value={newProject.technologies}
            onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
            placeholder="Technologies (comma separated)"
            className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <textarea
          value={newProject.description}
          onChange={(e) => setNewProject({...newProject, description: e.target.value})}
          placeholder="Brief project description..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
        />
        <button
          onClick={handleAdd}
          disabled={!newProject.title}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>
    </div>
  );
};

export default ProjectsForm;
