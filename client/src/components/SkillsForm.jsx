import { useState } from 'react';
import { Wrench, Plus, X, Lightbulb } from 'lucide-react';

const skillSuggestions = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'SQL', 'MongoDB',
  'AWS', 'Docker', 'Git', 'HTML/CSS', 'Java', 'C++', 'Go', 'Rust',
  'Machine Learning', 'Data Analysis', 'Project Management', 'Agile', 'Scrum',
  'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Critical Thinking'
];

const SkillsForm = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleAdd = () => {
    if (newSkill.trim() && !data.includes(newSkill.trim())) {
      onChange([...data, newSkill.trim()]);
      setNewSkill('');
      setSuggestions([]);
    }
  };

  const handleRemove = (skillToRemove) => {
    onChange(data.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleInputChange = (value) => {
    setNewSkill(value);
    if (value.trim()) {
      const filtered = skillSuggestions.filter(
        skill => skill.toLowerCase().includes(value.toLowerCase()) && !data.includes(skill)
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const addSuggestedSkill = (skill) => {
    if (!data.includes(skill)) {
      onChange([...data, skill]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Wrench className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
          <p className="text-sm text-gray-500">Add your technical and soft skills</p>
        </div>
      </div>

      {/* Current Skills */}
      {data.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
            >
              {skill}
              <button
                onClick={() => handleRemove(skill)}
                className="ml-1 p-0.5 hover:bg-primary-200 rounded-full transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add New Skill */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a skill and press Enter"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
            {/* Autocomplete Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setNewSkill(suggestion);
                      setSuggestions([]);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={!newSkill.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Quick Add Suggestions */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-700">Popular Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {skillSuggestions.filter(s => !data.includes(s)).slice(0, 12).map((skill, index) => (
              <button
                key={index}
                onClick={() => addSuggestedSkill(skill)}
                className="px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Tips for adding skills:</h4>
        <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
          <li>Include both technical skills (programming languages, tools) and soft skills</li>
          <li>Prioritize skills mentioned in job descriptions you're targeting</li>
          <li>Be specific (e.g., "React.js" instead of just "Web Development")</li>
          <li>Aim for 8-15 relevant skills</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillsForm;
