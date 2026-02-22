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
      // Use local calculation for immediate, accurate results
      const localResult = calculateLocalScore();
      
      // Try to get enhanced results from backend
      try {
        const resumeText = buildResumeText(resumeData);
        const response = await atsAPI.calculateScore(resumeText, jobDescription);
        
        if (response.success && response.data) {
          setResult(response.data);
        } else {
          setResult(localResult);
        }
      } catch (apiErr) {
        // Fallback to local calculation if API fails
        setResult(localResult);
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
    if (data.personalInfo?.fullName) parts.push(data.personalInfo.fullName);
    
    // Summary
    if (data.summary) parts.push(data.summary);
    
    // Skills
    if (data.skills?.length > 0) {
      parts.push(data.skills.join(' '));
    }
    
    // Experience
    data.experience?.forEach(exp => {
      if (exp.position) parts.push(exp.position);
      if (exp.company) parts.push(exp.company);
      if (exp.bullets?.length > 0) parts.push(exp.bullets.join(' '));
    });
    
    // Projects
    data.projects?.forEach(proj => {
      if (proj.title) parts.push(proj.title);
      if (proj.description) parts.push(proj.description);
      if (Array.isArray(proj.technologies)) {
        parts.push(proj.technologies.join(' '));
      }
      if (proj.bullets?.length > 0) parts.push(proj.bullets.join(' '));
    });
    
    // Education
    data.education?.forEach(edu => {
      if (edu.degree) parts.push(edu.degree);
      if (edu.fieldOfStudy) parts.push(edu.fieldOfStudy);
      if (edu.institution) parts.push(edu.institution);
    });
    
    // Certifications
    data.certifications?.forEach(cert => {
      if (cert.name) parts.push(cert.name);
      if (cert.issuer) parts.push(cert.issuer);
    });
    
    // Achievements
    data.achievements?.forEach(ach => {
      if (ach.title) parts.push(ach.title);
      if (ach.description) parts.push(ach.description);
    });
    
    return parts.join(' ').toLowerCase();
  };

  // Client-side keyword matching for immediate feedback
  const calculateLocalScore = () => {
    if (!jobDescription.trim()) return null;
    
    const resumeText = buildResumeText(resumeData);
    const jobText = jobDescription.toLowerCase();
    
    // Extract important keywords (words with 4+ characters, excluding common words)
    const commonWords = new Set(['with', 'from', 'they', 'have', 'this', 'that', 'will', 'been', 'their', 'were', 'are', 'and', 'for', 'the', 'you', 'your', 'our', 'all', 'any', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'she', 'use', 'her', 'way', 'many', 'oil', 'sit', 'set', 'run', 'eat', 'far', 'sea', 'eye', 'ago', 'off', 'too', 'any', 'say', 'man', 'try', 'ask', 'end', 'why', 'let', 'put', 'say', 'she', 'try', 'way', 'own', 'say', 'too', 'old', 'tell', 'very', 'when', 'much', 'would', 'there', 'should']);
    
    // Extract potential keywords from job description
    const words = jobText.match(/\b[a-z]+\b/g) || [];
    const wordFreq = {};
    words.forEach(word => {
      if (word.length >= 4 && !commonWords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    
    // Get top keywords (appearing multiple times or important technical terms)
    const technicalTerms = ['javascript', 'python', 'react', 'node', 'sql', 'database', 'api', 'html', 'css', 'aws', 'azure', 'docker', 'kubernetes', 'agile', 'scrum', 'git', 'github', 'frontend', 'backend', 'fullstack', 'developer', 'engineer', 'manager', 'analyst', 'design', 'testing', 'deployment', 'cloud', 'machine', 'learning', 'artificial', 'intelligence', 'data', 'analytics', 'security', 'network', 'server', 'client', 'framework', 'library', 'component', 'interface'];
    
    const keywords = Object.entries(wordFreq)
      .filter(([word, count]) => count >= 2 || technicalTerms.some(term => word.includes(term)))
      .map(([word]) => word)
      .slice(0, 30);
    
    // Check which keywords are in resume
    const matched = [];
    const missing = [];
    
    keywords.forEach(keyword => {
      if (resumeText.includes(keyword)) {
        matched.push(keyword);
      } else {
        missing.push(keyword);
      }
    });
    
    // Calculate score
    const total = keywords.length;
    const matchedCount = matched.length;
    const score = total > 0 ? Math.round((matchedCount / total) * 100) : 0;
    
    return {
      score,
      matchedCount,
      totalKeywords: total,
      matchedKeywords: matched,
      missingKeywords: missing.slice(0, 15) // Show top 15 missing
    };
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
