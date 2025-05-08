import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, User, MessageSquare, Calendar, LogOut, Search } from 'lucide-react';

interface Submission {
  id: string;
  name: string;
  message: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  timestamp: string;
}

const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin-login');
      return;
    }

    // Load submissions from localStorage
    const storedSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    setSubmissions(storedSubmissions);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/');
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      submission.name.toLowerCase().includes(searchLower) ||
      submission.id.toLowerCase().includes(searchLower) ||
      submission.message.toLowerCase().includes(searchLower) ||
      submission.fileName.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Submissions</h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {submissions.length} Total
                    </span>
                  </div>
                  
                  <div className="mb-4 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search submissions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="overflow-y-auto max-h-96 space-y-3">
                    {filteredSubmissions.length > 0 ? (
                      filteredSubmissions.map((submission, index) => (
                        <div
                          key={index}
                          className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                            selectedSubmission === submission ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <User className="h-5 w-5 text-gray-500 mr-2" />
                              <span className="font-medium text-gray-900">{submission.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">{formatDate(submission.timestamp)}</span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <FileText className="h-4 w-4 mr-1" />
                            {submission.fileName || 'No file attached'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        {searchTerm
                          ? 'No submissions match your search'
                          : 'No submissions yet'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="bg-white shadow overflow-hidden rounded-lg h-full">
                {selectedSubmission ? (
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-xl font-medium text-gray-900 mb-6">Submission Details</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Submitter Information</h3>
                        <div className="mt-3 bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center mb-3">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">Full Name</p>
                              <p className="font-medium text-gray-900">{selectedSubmission.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="inline-flex items-center justify-center h-5 w-5 text-gray-400 mr-2">#</span>
                            <div>
                              <p className="text-xs text-gray-500">ID Number</p>
                              <p className="font-medium text-gray-900">{selectedSubmission.id}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Submission Metadata</h3>
                        <div className="mt-3 bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center mb-3">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">Submission Date</p>
                              <p className="font-medium text-gray-900">{formatDate(selectedSubmission.timestamp)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="text-xs text-gray-500">File Attachment</p>
                              <div className="flex items-center">
                                <p className="font-medium text-gray-900 mr-2">
                                  {selectedSubmission.fileName || 'No file'}
                                </p>
                                {selectedSubmission.fileSize > 0 && (
                                  <span className="text-xs text-gray-500">
                                    {formatFileSize(selectedSubmission.fileSize)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start">
                          <MessageSquare className="h-5 w-5 text-gray-400 mr-2 mt-1" />
                          <p className="text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-6">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No submission selected</h3>
                      <p className="text-gray-500">
                        Select a submission from the list to view details
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;