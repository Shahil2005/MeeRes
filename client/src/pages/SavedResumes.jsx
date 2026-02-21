import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Trash2, 
  Eye, 
  Loader2, 
  Calendar, 
  User, 
  Mail,
  AlertCircle,
  Search,
  RefreshCw,
  Settings,
  LogOut,
  MapPin,
  Briefcase
} from 'lucide-react';
import { resumeAPI, authAPI } from '../services/api';

const SavedResumes = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch all resumes
  const fetchResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await resumeAPI.getAllResumes();
      if (response.success) {
        setResumes(response.data);
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
      setError('Failed to load saved resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load user data
  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
    fetchResumes();
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Delete a resume
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await resumeAPI.deleteResume(id);
      if (response.success) {
        setResumes(resumes.filter(resume => resume._id !== id));
      }
    } catch (err) {
      console.error('Error deleting resume:', err);
      alert('Failed to delete resume. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // View/Edit a resume
  const handleView = (id) => {
    // Navigate to builder with resume ID
    navigate(`/?resumeId=${id}`);
  };

  // Create new resume
  const handleCreateNew = () => {
    navigate('/');
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter resumes based on search term
  const filteredResumes = resumes.filter(resume => {
    const searchLower = searchTerm.toLowerCase();
    return (
      resume.personalInfo?.fullName?.toLowerCase().includes(searchLower) ||
      resume.personalInfo?.email?.toLowerCase().includes(searchLower) ||
      resume.summary?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saved Resumes</h1>
            <p className="text-sm text-gray-500">Manage and view your saved resumes</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Create New Resume
            </button>
            
            {/* User Profile Dropdown */}
            {user && (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(user.fullName)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                    <p className="text-xs text-gray-500">{user.profile?.title || 'View Profile'}</p>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or content..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>
          <button
            onClick={fetchResumes}
            className="flex items-center gap-2 px-4 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading saved resumes...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={fetchResumes}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredResumes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No matching resumes found' : 'No saved resumes yet'}
            </h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              {searchTerm 
                ? 'Try adjusting your search terms to find what you\'re looking for.'
                : 'Create your first resume to get started with your job application journey.'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Create New Resume
              </button>
            )}
          </div>
        )}

        {/* Resumes Grid */}
        {!loading && !error && filteredResumes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleView(resume._id)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View/Edit"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      disabled={deletingId === resume._id}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === resume._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Resume Info */}
                <div className="space-y-2 mb-4">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {resume.personalInfo?.fullName || 'Unnamed Resume'}
                  </h3>
                  {resume.personalInfo?.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{resume.personalInfo.email}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {resume.experience?.length > 0 && (
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      {resume.experience.length} Experience
                    </span>
                  )}
                  {resume.education?.length > 0 && (
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                      {resume.education.length} Education
                    </span>
                  )}
                  {resume.skills?.length > 0 && (
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                      {resume.skills.length} Skills
                    </span>
                  )}
                  {resume.atsScore > 0 && (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      resume.atsScore >= 80 ? 'bg-green-100 text-green-800' :
                      resume.atsScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      ATS: {resume.atsScore}%
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-4 border-t border-gray-100">
                  <Calendar className="w-3 h-3" />
                  <span>Created: {formatDate(resume.createdAt)}</span>
                </div>
                {resume.updatedAt !== resume.createdAt && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <RefreshCw className="w-3 h-3" />
                    <span>Updated: {formatDate(resume.updatedAt)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && filteredResumes.length > 0 && (
          <div className="mt-6 text-sm text-gray-500 text-center">
            Showing {filteredResumes.length} of {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedResumes;
