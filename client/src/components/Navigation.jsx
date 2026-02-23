import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LayoutTemplate, 
  FolderOpen, 
  Sparkles, 
  FileCheck, 
  FileText, 
  ArrowLeft,
  UserCircle,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { authAPI } from '../services/api';

const Navigation = ({ 
  showMenuButton = true,
  showProfile = true,
  title = null,
  onBack = null,
  backLabel = null
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activePanel, setActivePanel] = useState(null);

  // Load user data
  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
  }, []);

  // Set active panel based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/saved') {
      setActivePanel('saved');
    } else if (path === '/profile') {
      setActivePanel('profile');
    } else if (path === '/') {
      setActivePanel('builder');
    } else {
      setActivePanel(null);
    }
  }, [location.pathname]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const menuItems = [
    {
      id: 'saved',
      label: 'Saved Resumes',
      description: 'View your saved resumes',
      icon: FolderOpen,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100',
      hoverBg: 'hover:bg-blue-50',
      path: '/saved'
    },
    {
      id: 'builder',
      label: 'Resume Builder',
      description: 'Create or edit resume',
      icon: LayoutTemplate,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      hoverBg: 'hover:bg-indigo-50',
      path: '/'
    },
    {
      id: 'profile',
      label: 'Profile',
      description: 'Manage your account',
      icon: UserCircle,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100',
      hoverBg: 'hover:bg-purple-50',
      path: '/profile'
    }
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showMenuButton && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Open Menu"
              >
                <Menu className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Menu</span>
              </button>
            )}
            
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                {backLabel && <span>{backLabel}</span>}
              </button>
            )}

            {title && (
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            {showProfile && user && (
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="View Profile"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {getInitials(user.fullName)}
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Menu */}
      <div className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
        
        {/* Sidebar */}
        <div className={`relative w-80 bg-white shadow-2xl h-full overflow-y-auto transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Sidebar Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutTemplate className="w-6 h-6 text-white" />
              <span className="text-lg font-bold text-white">Resume Builder</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {getInitials(user.fullName)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.fullName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePanel === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSidebarOpen(false);
                    navigate(item.path);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                    isActive 
                      ? 'bg-gray-100 text-gray-900' 
                      : `${item.hoverBg} text-gray-700`
                  }`}
                >
                  <div className={`w-10 h-10 ${item.bgColor} rounded-lg flex items-center justify-center group-hover:opacity-80 transition-colors`}>
                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </button>
              );
            })}

            {/* Divider */}
            <div className="border-t border-gray-200 my-4" />

            {/* Logout */}
            {user ? (
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Logout</div>
                  <div className="text-xs text-gray-500">Sign out of your account</div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  navigate('/login');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Login</div>
                  <div className="text-xs text-gray-500">Sign in to your account</div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
