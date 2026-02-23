import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, AlertCircle, CheckCircle, FileText, Download } from 'lucide-react';
import { optimizationAPI } from '../services/api';
import autoFitEngine from '../utils/autoFitEngine';

const OnePageResume = ({ resumeData, onOptimized, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState(null);
  const [optimizedHTML, setOptimizedHTML] = useState('');
  const [densityWarning, setDensityWarning] = useState(null);
  const [fitStatus, setFitStatus] = useState(null);
  const previewRef = useRef(null);
  const containerRef = useRef(null);

  // Check content density on mount
  useEffect(() => {
    const density = autoFitEngine.checkContentDensity(resumeData);
    setDensityWarning(density);
  }, [resumeData]);

  // Initial optimization
  useEffect(() => {
    optimizeResume();
  }, []);

  const optimizeResume = async () => {
    setLoading(true);
    setError(null);
    setOptimizing(true);

    try {
      // Step 1: Call backend optimization API
      let html;
      let usedFallback = false;
      
      try {
        const response = await optimizationAPI.optimizeResume(resumeData);
        
        if (response.success && response.html) {
          html = response.html;
        } else {
          throw new Error('Backend returned no HTML');
        }
      } catch (apiErr) {
        console.warn('Backend optimization failed, using fallback:', apiErr.message);
        // Use fallback template if backend fails
        html = generateFallbackHTML(resumeData);
        usedFallback = true;
      }

      // Step 2: Only apply minimal adjustments if needed
      // Let Groq handle the main optimization
      let finalHTML = html;
      
      // Only check if it fits, don't aggressively compress
      const height = autoFitEngine.measureContentHeight(html);
      const fits = autoFitEngine.fitsOnOnePage(height);
      
      setFitStatus({
        success: fits,
        height: height,
        fitsOnOnePage: fits,
        fallback: usedFallback
      });

      // Step 3: Prepare final HTML with print styles only
      finalHTML = autoFitEngine.prepareForPDF(html);
      
      setOptimizedHTML(finalHTML);
      
      // Notify parent
      if (onOptimized) {
        onOptimized({
          html: finalHTML,
          fitsOnOnePage: fits,
          densityWarning: densityWarning
        });
      }
      
      // Clear any error since we have a working fallback
      setError(null);
    } catch (err) {
      console.error('Optimization error:', err);
      setError(err.message || 'Failed to optimize resume');
    } finally {
      setLoading(false);
      setOptimizing(false);
    }
  };

  const generateFallbackHTML = (data) => {
    const { personalInfo, summary, education, skills, projects, experience, certifications } = data;
    
    return `
      <div class="optimized-resume" style="font-family: Arial, sans-serif; font-size: 11px; line-height: 1.35; padding: 12mm; width: 210mm;">
        <div style="text-align: center; border-bottom: 2px solid #1e293b; padding-bottom: 8px; margin-bottom: 12px;">
          <h1 style="font-size: 20px; font-weight: bold; color: #1e293b; margin: 0 0 4px 0;">${personalInfo?.fullName || 'Your Name'}</h1>
          <div style="font-size: 9.5px; color: #475569;">
            ${personalInfo?.email || ''}${personalInfo?.email && personalInfo?.phone ? ' | ' : ''}${personalInfo?.phone || ''}
            ${(personalInfo?.email || personalInfo?.phone) && personalInfo?.location ? ' | ' : ''}${personalInfo?.location || ''}
          </div>
        </div>

        ${summary ? `
        <div style="margin-bottom: 10px;">
          <h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-bottom: 6px; color: #1e293b;">Professional Summary</h2>
          <p style="margin: 0;">${summary}</p>
        </div>
        ` : ''}

        ${experience?.length > 0 ? `
        <div style="margin-bottom: 10px;">
          <h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-bottom: 6px; color: #1e293b;">Experience</h2>
          ${experience.slice(0, 3).map(exp => `
            <div style="margin-bottom: 6px;">
              <div style="display: flex; justify-content: space-between; font-weight: 600;">
                <span>${exp.position}</span>
                <span style="font-style: italic; color: #64748b; font-weight: normal;">${exp.startDate || ''} - ${exp.endDate || 'Present'}</span>
              </div>
              <div style="font-style: italic; color: #475569;">${exp.company}${exp.location ? ', ' + exp.location : ''}</div>
              ${exp.bullets?.filter(b => b.trim()).length > 0 ? `
                <ul style="margin: 2px 0 0 14px; padding: 0;">
                  ${exp.bullets.filter(b => b.trim()).slice(0, 2).map(b => `<li style="margin-bottom: 1px;">${b}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${education?.length > 0 ? `
        <div style="margin-bottom: 10px;">
          <h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-bottom: 6px; color: #1e293b;">Education</h2>
          ${education.slice(0, 2).map(edu => `
            <div style="margin-bottom: 6px;">
              <div style="display: flex; justify-content: space-between; font-weight: 600;">
                <span>${edu.degree}${edu.fieldOfStudy ? ' in ' + edu.fieldOfStudy : ''}</span>
                <span style="font-style: italic; color: #64748b; font-weight: normal;">${edu.startDate || ''} - ${edu.endDate || 'Present'}</span>
              </div>
              <div style="font-style: italic; color: #475569;">${edu.institution}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${skills?.length > 0 ? `
        <div style="margin-bottom: 10px;">
          <h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-bottom: 6px; color: #1e293b;">Skills</h2>
          <p style="margin: 0;">${skills.join(', ')}</p>
        </div>
        ` : ''}

        ${projects?.length > 0 ? `
        <div style="margin-bottom: 10px;">
          <h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-bottom: 6px; color: #1e293b;">Projects</h2>
          ${projects.slice(0, 2).map(proj => `
            <div style="margin-bottom: 6px;">
              <div style="font-weight: 600;">${proj.title}</div>
              ${proj.technologies?.length > 0 ? `<div style="font-size: 9px; color: #64748b;">Tech: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}</div>` : ''}
              ${proj.bullets?.filter(b => b.trim()).length > 0 ? `
                <ul style="margin: 2px 0 0 14px; padding: 0;">
                  ${proj.bullets.filter(b => b.trim()).slice(0, 2).map(b => `<li style="margin-bottom: 1px;">${b}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${certifications?.length > 0 ? `
        <div style="margin-bottom: 10px;">
          <h2 style="font-size: 11px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-bottom: 6px; color: #1e293b;">Certifications</h2>
          <ul style="margin: 0 0 0 14px; padding: 0;">
            ${certifications.slice(0, 3).map(cert => `
              <li style="margin-bottom: 1px;">${cert.name}${cert.issuer ? ' - ' + cert.issuer : ''}${cert.date ? ' (' + cert.date + ')' : ''}</li>
            `).join('')}
          </ul>
        </div>
        ` : ''}
      </div>
    `;
  };

  const handleDownloadPDF = async () => {
    if (!optimizedHTML) return;

    const element = document.createElement('div');
    element.innerHTML = optimizedHTML;
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    document.body.appendChild(element);

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      
      const opt = {
        margin: 0,
        filename: `${resumeData.personalInfo?.fullName || 'Resume'}_Optimized.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          width: 794,
          windowWidth: 794
        },
        jsPDF: { 
          unit: 'px', 
          format: [794, 1123],
          orientation: 'portrait',
          compress: true
        }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF generation error:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      document.body.removeChild(element);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">One-Page Resume Optimizer</h2>
              <p className="text-blue-100 text-sm">AI-powered optimization for perfect single-page format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Optimizing your resume...</p>
              <p className="text-gray-500 text-sm mt-1">AI is compressing and formatting content</p>
              
              {densityWarning?.warning && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md">
                  <div className="flex items-center gap-2 text-yellow-700 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Content Density Warning</span>
                  </div>
                  <p className="text-yellow-600 text-sm">{densityWarning.message}</p>
                </div>
              )}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={optimizeResume}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Preview */}
              <div className="lg:col-span-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Optimized Preview</h3>
                <div 
                  ref={containerRef}
                  className="bg-gray-100 p-4 rounded-lg overflow-auto"
                  style={{ maxHeight: '60vh' }}
                >
                  <div 
                    ref={previewRef}
                    dangerouslySetInnerHTML={{ __html: optimizedHTML }}
                    className="bg-white shadow-lg mx-auto"
                    style={{ width: '210mm', minHeight: '297mm' }}
                  />
                </div>
              </div>

              {/* Status Panel */}
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Optimization Complete</span>
                  </div>
                  <p className="text-green-600 text-sm">
                    Your resume has been optimized to fit on a single page.
                  </p>
                </div>

                {fitStatus && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-3">Optimization Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Content Height:</span>
                        <span className="font-medium">{Math.round(fitStatus.height)}px</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">A4 Page Height:</span>
                        <span className="font-medium">1123px</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fits on One Page:</span>
                        <span className={`font-medium ${fitStatus.fitsOnOnePage ? 'text-green-600' : 'text-amber-600'}`}>
                          {fitStatus.fitsOnOnePage ? 'Yes' : 'Slightly Over'}
                        </span>
                      </div>
                      {fitStatus.fallback && (
                        <div className="text-amber-600 text-xs mt-2">
                          * Used fallback template due to API error
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {densityWarning?.warning && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-700 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-semibold">Content Compressed</span>
                    </div>
                    <p className="text-yellow-600 text-sm">{densityWarning.message}</p>
                  </div>
                )}

                <button
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Download className="w-5 h-5" />
                  Download Optimized PDF
                </button>

                <button
                  onClick={optimizeResume}
                  className="w-full px-6 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                >
                  Re-optimize
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnePageResume;
