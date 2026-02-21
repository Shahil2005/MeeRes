import { FileText, Sparkles } from 'lucide-react';

const SummaryForm = ({ data, onChange }) => {
  const handleChange = (value) => {
    onChange(value);
  };

  const suggestions = [
    "Results-driven software engineer with 5+ years of experience in full-stack development...",
    "Creative marketing professional specializing in digital campaigns and brand strategy...",
    "Detail-oriented data analyst with expertise in Python, SQL, and data visualization..."
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Professional Summary</h2>
          <p className="text-sm text-gray-500">Write a compelling summary of your professional background</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Professional Summary
          </label>
          <textarea
            value={data || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Write a brief summary highlighting your key skills, experience, and career goals..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Recommended: 3-5 sentences</span>
            <span>{(data || '').length} characters</span>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Writing Tips</span>
          </div>
          <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
            <li>Start with your job title and years of experience</li>
            <li>Highlight 2-3 key skills relevant to your target role</li>
            <li>Include a notable achievement or quantifiable result</li>
            <li>End with your career goals or what you're looking for</li>
          </ul>
        </div>

        {/* Example Suggestions */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Example Summaries:</span>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleChange(suggestion)}
                className="w-full text-left p-3 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryForm;
