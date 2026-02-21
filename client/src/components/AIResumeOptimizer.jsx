import { useState } from 'react';
import { Sparkles, Loader2, Wand2, CheckCircle, AlertCircle, X, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { aiAPI } from '../services/api';

const AIResumeOptimizer = ({ resumeData, onOptimized, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [optimizedData, setOptimizedData] = useState(null);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [optimizationOptions, setOptimizationOptions] = useState({
    summary: true,
    experience: true,
    projects: true,
    achievements: true,
    skills: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const optimizeResume = async () => {
    setLoading(true);
    setError(null);
    setProgressPercent(0);
    
    try {
      const optimized = { ...resumeData };
      let totalSteps = 0;
      let currentStep = 0;

      // Calculate total steps
      if (optimizationOptions.summary && resumeData.summary) totalSteps++;
      if (optimizationOptions.experience) {
        totalSteps += resumeData.experience.reduce((acc, exp) => acc + exp.bullets.filter(b => b.trim()).length, 0);
      }
      if (optimizationOptions.projects) {
        totalSteps += resumeData.projects.reduce((acc, proj) => acc + proj.bullets.filter(b => b.trim()).length, 0);
      }
      if (optimizationOptions.achievements) {
        totalSteps += resumeData.achievements.filter(a => a.description).length;
      }

      // Optimize Summary
      if (optimizationOptions.summary && resumeData.summary) {
        setProgress('Optimizing professional summary...');
        const summaryResponse = await aiAPI.enhanceBullet(
          `Professional Summary: ${resumeData.summary}. Make this compelling, concise (2-3 sentences), and highlight key achievements and skills for a single-page resume.`
        );
        if (summaryResponse.success) {
          optimized.summary = summaryResponse.enhancedText;
        }
        currentStep++;
        setProgressPercent(Math.round((currentStep / totalSteps) * 100));
      }

      // Optimize Experience Bullets - ALL bullets
      if (optimizationOptions.experience && resumeData.experience.length > 0) {
        setProgress('Optimizing work experience...');
        optimized.experience = [];
        for (let i = 0; i < resumeData.experience.length; i++) {
          const exp = resumeData.experience[i];
          const optimizedBullets = [];
          for (let j = 0; j < exp.bullets.length; j++) {
            const bullet = exp.bullets[j];
            if (bullet.trim()) {
              setProgress(`Optimizing: ${exp.position} - Bullet ${j + 1}/${exp.bullets.length}`);
              const response = await aiAPI.enhanceBullet(bullet);
              optimizedBullets.push(response.success ? response.enhancedText : bullet);
              currentStep++;
              setProgressPercent(Math.round((currentStep / totalSteps) * 100));
            } else {
              optimizedBullets.push(bullet);
            }
          }
          optimized.experience.push({ ...exp, bullets: optimizedBullets });
        }
      }

      // Optimize Project Bullets - ALL bullets
      if (optimizationOptions.projects && resumeData.projects.length > 0) {
        setProgress('Optimizing projects...');
        optimized.projects = [];
        for (let i = 0; i < resumeData.projects.length; i++) {
          const proj = resumeData.projects[i];
          const optimizedBullets = [];
          for (let j = 0; j < proj.bullets.length; j++) {
            const bullet = proj.bullets[j];
            if (bullet.trim()) {
              setProgress(`Optimizing: ${proj.title} - Bullet ${j + 1}/${proj.bullets.length}`);
              const response = await aiAPI.enhanceBullet(bullet);
              optimizedBullets.push(response.success ? response.enhancedText : bullet);
              currentStep++;
              setProgressPercent(Math.round((currentStep / totalSteps) * 100));
            } else {
              optimizedBullets.push(bullet);
            }
          }
          optimized.projects.push({ ...proj, bullets: optimizedBullets });
        }
      }

      // Optimize Achievements - ALL achievements
      if (optimizationOptions.achievements && resumeData.achievements.length > 0) {
        setProgress('Optimizing achievements...');
        optimized.achievements = [];
        for (let i = 0; i < resumeData.achievements.length; i++) {
          const achievement = resumeData.achievements[i];
          if (achievement.description) {
            setProgress(`Optimizing achievement: ${achievement.title}`);
            const response = await aiAPI.enhanceBullet(
              `Achievement: ${achievement.title} - ${achievement.description}. Make this impactful and concise.`
            );
            if (response.success) {
              optimized.achievements.push({ ...achievement, description: response.enhancedText });
            } else {
              optimized.achievements.push(achievement);
            }
            currentStep++;
            setProgressPercent(Math.round((currentStep / totalSteps) * 100));
          } else {
            optimized.achievements.push(achievement);
          }
        }
      }

      setOptimizedData(optimized);
      setProgress('Optimization complete!');
      setProgressPercent(100);
    } catch (err) {
      console.error('Optimization error:', err);
      setError('Failed to optimize resume. Please check your Groq API configuration.');
    } finally {
      setLoading(false);
    }
  };

  const applyOptimization = () => {
    if (optimizedData) {
      onOptimized(optimizedData);
      onClose();
    }
  };

  const getChangesCount = () => {
    if (!optimizedData) return 0;
    let count = 0;
    if (optimizedData.summary !== resumeData.summary) count++;
    optimizedData.experience.forEach((exp, i) => {
      exp.bullets.forEach((b, j) => {
        if (b !== resumeData.experience[i]?.bullets[j]) count++;
      });
    });
    optimizedData.projects.forEach((proj, i) => {
      proj.bullets.forEach((b, j) => {
        if (b !== resumeData.projects[i]?.bullets[j]) count++;
      });
    });
    optimizedData.achievements.forEach((ach, i) => {
      if (ach.description !== resumeData.achievements[i]?.description) count++;
    });
    return count;
  };

  const getTotalItems = () => {
    let total = 0;
    if (optimizationOptions.summary && resumeData.summary) total++;
    if (optimizationOptions.experience) {
      total += resumeData.experience.reduce((acc, exp) => acc + exp.bullets.filter(b => b.trim()).length, 0);
    }
    if (optimizationOptions.projects) {
      total += resumeData.projects.reduce((acc, proj) => acc + proj.bullets.filter(b => b.trim()).length, 0);
    }
    if (optimizationOptions.achievements) {
      total += resumeData.achievements.filter(a => a.description).length;
    }
    return total;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Wand2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Resume Optimizer</h2>
                <p className="text-purple-100 text-sm">Complete resume enhancement for maximum impact</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {!optimizedData && !loading && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Complete Resume Optimization
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  AI will review and enhance ALL your content for a professional, ATS-friendly single-page resume.
                </p>
              </div>

              {/* Optimization Options */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Select sections to optimize:</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={optimizationOptions.summary}
                      onChange={(e) => setOptimizationOptions(prev => ({ ...prev, summary: e.target.checked }))}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-700">Professional Summary</span>
                      <p className="text-xs text-gray-500">Make it compelling and concise</p>
                    </div>
                    {resumeData.summary && <span className="text-xs text-green-600">✓ Available</span>}
                  </label>

                  <label className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={optimizationOptions.experience}
                      onChange={(e) => setOptimizationOptions(prev => ({ ...prev, experience: e.target.checked }))}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-700">Work Experience</span>
                      <p className="text-xs text-gray-500">All bullets with action verbs & metrics</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {resumeData.experience.reduce((acc, exp) => acc + exp.bullets.filter(b => b.trim()).length, 0)} bullets
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={optimizationOptions.projects}
                      onChange={(e) => setOptimizationOptions(prev => ({ ...prev, projects: e.target.checked }))}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-700">Projects</span>
                      <p className="text-xs text-gray-500">Highlight technical achievements</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {resumeData.projects.reduce((acc, proj) => acc + proj.bullets.filter(b => b.trim()).length, 0)} bullets
                    </span>
                  </label>

                  <label className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={optimizationOptions.achievements}
                      onChange={(e) => setOptimizationOptions(prev => ({ ...prev, achievements: e.target.checked }))}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-700">Achievements</span>
                      <p className="text-xs text-gray-500">Make them impactful and measurable</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {resumeData.achievements.filter(a => a.description).length} items
                    </span>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">What will be optimized:</h4>
                    <ul className="text-sm text-blue-800 mt-1 space-y-1">
                      <li>• Strong action verbs (Led, Developed, Implemented)</li>
                      <li>• Quantifiable metrics (%, $, time saved)</li>
                      <li>• ATS-friendly keywords</li>
                      <li>• Concise wording for single-page format</li>
                      <li>• Professional tone and clarity</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={optimizeResume}
                disabled={getTotalItems() === 0}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5" />
                Optimize {getTotalItems()} Items
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-2">{progress}</p>
              <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto mb-2">
                <div 
                  className="h-full bg-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-gray-500 text-sm">{progressPercent}% complete</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => { setError(null); setLoading(false); }}
                className="mt-3 flex items-center gap-2 text-sm text-red-600 hover:text-red-800"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}

          {optimizedData && !loading && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Optimization Complete!</span>
                </div>
                <p className="text-green-700 text-sm">
                  {getChangesCount()} items enhanced for maximum impact while maintaining single-page format.
                </p>
              </div>

              {/* Changes Preview */}
              {optimizedData.summary !== resumeData.summary && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('summary')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900">Professional Summary</span>
                    {expandedSections.summary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedSections.summary && (
                    <div className="p-3 space-y-2">
                      <div className="text-xs text-gray-500 line-through">{resumeData.summary}</div>
                      <div className="text-sm text-green-700 font-medium">{optimizedData.summary}</div>
                    </div>
                  )}
                </div>
              )}

              {optimizedData.experience.some((exp, i) => 
                exp.bullets.some((b, j) => b !== resumeData.experience[i]?.bullets[j])
              ) && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('experience')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900">Work Experience Changes</span>
                    {expandedSections.experience ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedSections.experience && (
                    <div className="p-3 space-y-3 max-h-60 overflow-y-auto">
                      {optimizedData.experience.map((exp, i) => 
                        exp.bullets.map((bullet, j) => {
                          if (bullet === resumeData.experience[i]?.bullets[j]) return null;
                          return (
                            <div key={`${i}-${j}`} className="text-sm">
                              <div className="font-medium text-gray-700">{exp.position} at {exp.company}</div>
                              <div className="text-xs text-gray-500 line-through mt-1">{resumeData.experience[i]?.bullets[j]}</div>
                              <div className="text-green-700 mt-1">{bullet}</div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              )}

              {optimizedData.projects.some((proj, i) => 
                proj.bullets.some((b, j) => b !== resumeData.projects[i]?.bullets[j])
              ) && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('projects')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900">Project Changes</span>
                    {expandedSections.projects ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedSections.projects && (
                    <div className="p-3 space-y-3 max-h-60 overflow-y-auto">
                      {optimizedData.projects.map((proj, i) => 
                        proj.bullets.map((bullet, j) => {
                          if (bullet === resumeData.projects[i]?.bullets[j]) return null;
                          return (
                            <div key={`${i}-${j}`} className="text-sm">
                              <div className="font-medium text-gray-700">{proj.title}</div>
                              <div className="text-xs text-gray-500 line-through mt-1">{resumeData.projects[i]?.bullets[j]}</div>
                              <div className="text-green-700 mt-1">{bullet}</div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {optimizedData && !loading && (
          <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
            <button
              onClick={() => { setOptimizedData(null); setProgressPercent(0); }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              onClick={applyOptimization}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Apply All Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIResumeOptimizer;
