import { useState } from 'react';
import { Target, Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { atsAPI } from '../services/api';

const ATSScore = ({ resumeData }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const calculateScore = async () => {
    if (!jobDescription.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Build resume text from data
      const resumeText = buildResumeText(resumeData);
      const response = await atsAPI.calculateScore(resumeText, jobDescription);
      
      if (response.success) {
        setResult(response);
      }
    } catch (err) {
      setError('Failed to calculate ATS score. Please try again.');
      console.error('ATS calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const buildResumeText = (data) => {
    const parts = [];
    
    // Personal info
    if (data.personalInfo.fullName) parts.push(data.personalInfo.fullName);
    
    // Summary
    if (data.summary) parts.push(data.summary);
    
    // Skills
    if (data.skills.length > 0) {
      parts.push(data.skills.join(' '));
    }
    
    // Experience
    data.experience.forEach(exp => {
      parts.push(exp.position);
      parts.push(exp.company);
      parts.push(exp.bullets.join(' '));
    });
    
    // Projects
    data.projects.forEach(proj => {
      parts.push(proj.title);
      parts.push(proj.description);
      if (Array.isArray(proj.technologies)) {
        parts.push(proj.technologies.join(' '));
      }
      parts.push(proj.bullets.join(' '));
    });
    
    // Education
    data.education.forEach(edu => {
      parts.push(edu.degree);
      parts.push(edu.fieldOfStudy);
      parts.push(edu.institution);
    });
    
    // Certifications
    data.certifications.forEach(cert => {
      parts.push(cert.name);
      parts.push(cert.issuer);
    });
    
    return parts.join(' ');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Target className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">ATS Score Calculator</h2>
          <p className="text-sm text-gray-500">Check how well your resume matches a job description</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to calculate your ATS match score..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
          />
        </div>

        <button
          onClick={calculateScore}
          disabled={loading || !jobDescription.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Target className="w-4 h-4" />
              Calculate ATS Score
            </>
          )}
        </button>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {result && (
          <div className="animate-fade-in space-y-4">
            {/* Score Display */}
            <div className={`p-6 rounded-lg ${getScoreBg(result.score)}`}>
              <div className="text-center">
                <span className="text-sm font-medium text-gray-600">Your ATS Score</span>
                <div className={`text-5xl font-bold ${getScoreColor(result.score)} mt-2`}>
                  {result.score}%
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {result.score >= 80 
                    ? 'Excellent match! Your resume is well-optimized for this job.'
                    : result.score >= 60
                      ? 'Good match, but there\'s room for improvement.'
                      : 'Your resume needs optimization for this job.'}
                </p>
              </div>
            </div>

            {/* Keyword Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Matched Keywords</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{result.matchedCount}</span>
                <span className="text-sm text-green-600"> / {result.totalKeywords}</span>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Missing Keywords</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{result.missingKeywords?.length || 0}</span>
              </div>
            </div>

            {/* Missing Keywords */}
            {result.missingKeywords && result.missingKeywords.length > 0 && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Keywords to Add:</h4>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white border border-gray-300 rounded text-sm text-gray-600"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Optimization Tips:</h4>
              <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                <li>Include missing keywords naturally in your resume</li>
                <li>Use exact phrases from the job description when possible</li>
                <li>Place important keywords in your summary and experience sections</li>
                <li>Quantify your achievements with numbers and metrics</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSScore;
