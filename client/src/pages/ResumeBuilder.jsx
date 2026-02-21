import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Download, Save, ChevronLeft, ChevronRight, Target, FolderOpen, ArrowLeft, Loader2, Wand2, UserCircle } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { authAPI } from '../services/api';

// Components
import Stepper from '../components/Stepper';
import PersonalInfoForm from '../components/PersonalInfoForm';
import SummaryForm from '../components/SummaryForm';
import EducationForm from '../components/EducationForm';
import SkillsForm from '../components/SkillsForm';
import ExperienceForm from '../components/ExperienceForm';
import ProjectsForm from '../components/ProjectsForm';
import CertificationsForm from '../components/CertificationsForm';
import AchievementsForm from '../components/AchievementsForm';
import ResumePreview from '../components/ResumePreview';
import ATSScore from '../components/ATSScore';
import AIResumeOptimizer from '../components/AIResumeOptimizer';

// API
import { resumeAPI } from '../services/api';

const steps = [
  { id: 'personal', label: 'Personal', component: PersonalInfoForm },
  { id: 'summary', label: 'Summary', component: SummaryForm },
  { id: 'education', label: 'Education', component: EducationForm },
  { id: 'skills', label: 'Skills', component: SkillsForm },
  { id: 'experience', label: 'Experience', component: ExperienceForm },
  { id: 'projects', label: 'Projects', component: ProjectsForm },
  { id: 'certifications', label: 'Certifications', component: CertificationsForm },
  { id: 'achievements', label: 'Achievements', component: AchievementsForm },
];

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState('personal');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showATS, setShowATS] = useState(false);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Resume data state
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedIn: '',
      portfolio: ''
    },
    summary: '',
    education: [],
    skills: [],
    projects: [],
    experience: [],
    certifications: [],
    achievements: []
  });

  const [user, setUser] = useState(null);

  const previewRef = useRef(null);

  // Load user data
  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Load existing resume if resumeId is in URL
  useEffect(() => {
    const loadResumeId = searchParams.get('resumeId');
    if (loadResumeId) {
      loadExistingResume(loadResumeId);
    }
  }, [searchParams]);

  // Load existing resume
  const loadExistingResume = async (id) => {
    setLoading(true);
    try {
      const response = await resumeAPI.getResume(id);
      if (response.success) {
        const data = response.data;
        setResumeData({
          personalInfo: data.personalInfo || {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            linkedIn: '',
            portfolio: ''
          },
          summary: data.summary || '',
          education: data.education || [],
          skills: data.skills || [],
          projects: data.projects || [],
          experience: data.experience || [],
          certifications: data.certifications || [],
          achievements: data.achievements || []
        });
        setResumeId(data._id);
        showNotification('Resume loaded successfully!');
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      showNotification('Failed to load resume', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle step change
  const handleStepChange = (stepId) => {
    // Mark current step as completed if it has data
    const currentStepData = getStepData(currentStep);
    const isCurrentStepComplete = checkStepCompletion(currentStep, currentStepData);
    
    if (isCurrentStepComplete && !completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    setCurrentStep(stepId);
    setShowATS(false);
  };

  // Get data for current step
  const getStepData = (stepId) => {
    switch (stepId) {
      case 'personal': return resumeData.personalInfo;
      case 'summary': return resumeData.summary;
      case 'education': return resumeData.education;
      case 'skills': return resumeData.skills;
      case 'experience': return resumeData.experience;
      case 'projects': return resumeData.projects;
      case 'certifications': return resumeData.certifications;
      case 'achievements': return resumeData.achievements;
      default: return null;
    }
  };

  // Check if step is complete
  const checkStepCompletion = (stepId, data) => {
    switch (stepId) {
      case 'personal':
        return data.fullName && data.email;
      case 'summary':
        return data && data.length > 20;
      case 'education':
      case 'skills':
      case 'experience':
      case 'projects':
      case 'certifications':
      case 'achievements':
        return Array.isArray(data) && data.length > 0;
      default:
        return false;
    }
  };

  // Update data for current step
  const handleDataChange = (newData) => {
    setResumeData(prev => ({
      ...prev,
      [currentStep === 'personal' ? 'personalInfo' : currentStep]: newData
    }));
  };

  // Navigate to next step
  const handleNext = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      // Mark current as complete
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep(steps[currentIndex + 1].id);
      setShowATS(false);
    }
  };

  // Navigate to previous step
  const handlePrevious = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
      setShowATS(false);
    }
  };

  // Save resume to database
  const handleSave = async () => {
    setSaving(true);
    try {
      let response;
      if (resumeId) {
        response = await resumeAPI.updateResume(resumeId, resumeData);
      } else {
        response = await resumeAPI.createResume(resumeData);
        if (response.success) {
          setResumeId(response.data._id);
        }
      }
      showNotification('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error);
      showNotification('Failed to save resume. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Export resume as PDF
  const handleExportPDF = () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    // Clone the element to modify for PDF without affecting the display
    const clonedElement = element.cloneNode(true);
    clonedElement.style.boxShadow = 'none';
    clonedElement.style.borderRadius = '0';
    
    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.appendChild(clonedElement);
    document.body.appendChild(container);

    const opt = {
      margin: [0.25, 0.35, 0.25, 0.35], // top, right, bottom, left in inches
      filename: `${resumeData.personalInfo.fullName || 'Resume'}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2.5,
        useCORS: true,
        letterRendering: true,
        width: 800,
        windowWidth: 800,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait',
        compress: true,
        hotfixes: ['px_scaling']
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(clonedElement).save().then(() => {
      document.body.removeChild(container);
    });
    
    showNotification('PDF download started!');
  };

  // Get current step component
  const CurrentStepComponent = steps.find(s => s.id === currentStep)?.component;
  const currentStepData = getStepData(currentStep);

  // Check if we can go next
  const currentIndex = steps.findIndex(s => s.id === currentStep);
  const canGoNext = currentIndex < steps.length - 1;
  const canGoPrevious = currentIndex > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in ${
          notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-700">Loading resume...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/saved')}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Saved Resumes"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {resumeId ? 'Edit Resume' : 'Resume Builder'}
              </h1>
              <p className="text-sm text-gray-500">
                {resumeId ? 'Editing existing resume' : 'AI-Powered Resume Creator'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/saved')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              Saved Resumes
            </button>
            <button
              onClick={() => setShowOptimizer(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
            >
              <Wand2 className="w-4 h-4" />
              AI Optimize
            </button>
            <button
              onClick={() => setShowATS(!showATS)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showATS 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Target className="w-4 h-4" />
              ATS Score
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            
            {/* Profile Icon */}
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-2 border-l border-gray-200 pl-4"
              title="View Profile"
            >
              {user ? (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {getInitials(user.fullName)}
                </div>
              ) : (
                <UserCircle className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <Stepper 
        currentStep={currentStep} 
        onStepClick={handleStepChange}
        completedSteps={completedSteps}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-4">
            {showATS ? (
              <ATSScore resumeData={resumeData} />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {CurrentStepComponent && (
                  <CurrentStepComponent 
                    data={currentStepData} 
                    onChange={handleDataChange} 
                  />
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handlePrevious}
                    disabled={!canGoPrevious}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!canGoNext}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-32 lg:h-fit">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Live Preview</h3>
                <span className="text-xs text-gray-500">Updates in real-time</span>
              </div>
              <div className="transform scale-90 origin-top">
                <ResumePreview data={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Resume Optimizer Modal */}
      {showOptimizer && (
        <AIResumeOptimizer
          resumeData={resumeData}
          onOptimized={(optimized) => {
            setResumeData(optimized);
            showNotification('Resume optimized successfully!');
          }}
          onClose={() => setShowOptimizer(false)}
        />
      )}
    </div>
  );
};

export default ResumeBuilder;
