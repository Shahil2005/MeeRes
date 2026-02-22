import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Linkedin, 
  Github, 
  Globe,
  Edit2,
  Save,
  X,
  Loader2,
  FileText,
  Calendar,
  LogOut,
  ArrowLeft,
  Camera
} from 'lucide-react';
import { authAPI } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    profile: {
      phone: '',
      location: '',
      title: '',
      bio: '',
      linkedIn: '',
      github: '',
      website: ''
    }
  });

  // Load user data on mount
  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        profile: {
          phone: currentUser.profile?.phone || '',
          location: currentUser.profile?.location || '',
          title: currentUser.profile?.title || '',
          bio: currentUser.profile?.bio || '',
          linkedIn: currentUser.profile?.linkedIn || '',
          github: currentUser.profile?.github || '',
          website: currentUser.profile?.website || ''
        }
      });
    }
    // If no user, show empty profile (don't redirect - let user see the page)
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      // TODO: Replace with actual API call
      // const response = await authAPI.updateProfile(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local storage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Default user for display when not logged in
  const displayUser = user || {
    fullName: 'Guest User',
    email: 'Not logged in',
    profile: {
      title: 'Please log in to view your profile',
      phone: '',
      location: '',
      bio: '',
      linkedIn: '',
      github: '',
      website: ''
    },
    stats: {
      totalResumes: 0
    },
    createdAt: null
  };

  const handleCancel = () => {
    setFormData({
      fullName: displayUser?.fullName || '',
      email: displayUser?.email || '',
      profile: {
        phone: displayUser?.profile?.phone || '',
        location: displayUser?.profile?.location || '',
        title: displayUser?.profile?.title || '',
        bio: displayUser?.profile?.bio || '',
        linkedIn: displayUser?.profile?.linkedIn || '',
        github: displayUser?.profile?.github || '',
        website: displayUser?.profile?.website || ''
      }
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/saved')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Resumes</span>
            </button>
          </div>
          <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Avatar Section */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 mx-auto shadow-lg">
                    {getInitials(displayUser.fullName)}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-bold text-white">{displayUser.fullName}</h2>
                <p className="text-blue-100">{displayUser.profile?.title || 'No title set'}</p>
              </div>

              {/* Quick Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-gray-900">{displayUser.stats?.totalResumes || 0}</p>
                    <p className="text-xs text-gray-500">Resumes</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-gray-900">
                      {displayUser.createdAt ? new Date(displayUser.createdAt).getFullYear() : '-'}
                    </p>
                    <p className="text-xs text-gray-500">Member Since</p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-6 space-y-3">
                  {displayUser.profile?.linkedIn && (
                    <a href={displayUser.profile.linkedIn} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
                      <Linkedin className="w-5 h-5" />
                      <span className="text-sm truncate">LinkedIn Profile</span>
                    </a>
                  )}
                  {displayUser.profile?.github && (
                    <a href={displayUser.profile.github} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
                      <Github className="w-5 h-5" />
                      <span className="text-sm truncate">GitHub Profile</span>
                    </a>
                  )}
                  {displayUser.profile?.website && (
                    <a href={displayUser.profile.website} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition-colors">
                      <Globe className="w-5 h-5" />
                      <span className="text-sm truncate">Personal Website</span>
                    </a>
                  )}
                </div>

                {/* Edit Button - only show if user is logged in */}
                {!isEditing && user && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
                {!user && (
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Login to Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details / Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditing ? 'Edit Profile' : 'Profile Information'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {isEditing ? 'Update your personal information' : 'Your personal and contact information'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{displayUser.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{displayUser.email}</p>
                    )}
                  </div>

                  {/* Professional Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="w-4 h-4 inline mr-2" />
                      Professional Title
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="profile.title"
                        value={formData.profile.title}
                        onChange={handleChange}
                        placeholder="e.g., Software Engineer"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{displayUser.profile?.title || 'Not set'}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="profile.phone"
                        value={formData.profile.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{displayUser.profile?.phone || 'Not set'}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="profile.location"
                        value={formData.profile.location}
                        onChange={handleChange}
                        placeholder="e.g., New York, NY"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{displayUser.profile?.location || 'Not set'}</p>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        name="profile.bio"
                        value={formData.profile.bio}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us a bit about yourself..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{displayUser.profile?.bio || 'No bio added yet'}</p>
                    )}
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Linkedin className="w-4 h-4 inline mr-2" />
                      LinkedIn URL
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="profile.linkedIn"
                        value={formData.profile.linkedIn}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    ) : (
                      <p className="text-gray-900 py-2 truncate">{displayUser.profile?.linkedIn || 'Not set'}</p>
                    )}
                  </div>

                  {/* GitHub */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Github className="w-4 h-4 inline mr-2" />
                      GitHub URL
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="profile.github"
                        value={formData.profile.github}
                        onChange={handleChange}
                        placeholder="https://github.com/username"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    ) : (
                      <p className="text-gray-900 py-2 truncate">{displayUser.profile?.github || 'Not set'}</p>
                    )}
                  </div>

                  {/* Website */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Globe className="w-4 h-4 inline mr-2" />
                      Personal Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="profile.website"
                        value={formData.profile.website}
                        onChange={handleChange}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    ) : (
                      <p className="text-gray-900 py-2 truncate">{displayUser.profile?.website || 'Not set'}</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="mt-8 flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
