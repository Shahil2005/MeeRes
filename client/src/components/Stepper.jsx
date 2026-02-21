import { User, GraduationCap, Wrench, FolderGit, Briefcase, Award, Trophy, FileText, CheckCircle } from 'lucide-react';

const steps = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderGit },
  { id: 'certifications', label: 'Certs', icon: Award },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
];

const Stepper = ({ currentStep, onStepClick, completedSteps }) => {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between overflow-x-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = completedSteps.includes(step.id);
            const isClickable = index <= currentIndex + 1 || isCompleted;

            return (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={`
                    flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'text-primary-600 bg-primary-50' 
                      : isCompleted
                        ? 'text-green-600 hover:bg-green-50'
                        : isClickable
                          ? 'text-gray-500 hover:bg-gray-100'
                          : 'text-gray-300 cursor-not-allowed'
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${isActive 
                      ? 'bg-primary-600 text-white' 
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {isCompleted && !isActive ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap">{step.label}</span>
                </button>
                
                {index < steps.length - 1 && (
                  <div className={`
                    w-4 h-0.5 mx-1 flex-shrink-0
                    ${index < currentIndex || isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stepper;
