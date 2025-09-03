import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Page.css';

function CreatorPage() {
  const [company, setCompany] = useState('');
  const [idea, setIdea] = useState('');
  const [amount, setAmount] = useState('');
  const [data, setData] = useState([]);
  const [investmentSummary, setInvestmentSummary] = useState([]);
  const [activeTab, setActiveTab] = useState('view');
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Get user info from localStorage (set during login)
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!userInfo) {
      alert('User information not found. Please login again.');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/creator/${editingId}`, {
          company,
          idea,
          name: userInfo.username, // Use logged-in username
          amount,
        });
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/creator', {
          company,
          idea,
          name: userInfo.username, // Use logged-in username
          amount,
          userId: userInfo.userId,
        });
      }

      setCompany('');
      setIdea('');
      setAmount('');
      fetchData();
      fetchInvestmentSummary();
      setActiveTab('view');
    } catch (error) {
      console.error('Error saving company:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    if (!userInfo) return;
    
    try {
      const res = await axios.get(`http://localhost:5000/api/creator/${userInfo.userId}`);
      setData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchInvestmentSummary = async () => {
    if (!userInfo) return;
    
    try {
      const res = await axios.get(`http://localhost:5000/api/investments/creator/${userInfo.userId}`);
      setInvestmentSummary(res.data);
    } catch (error) {
      console.error('Error fetching investment summary:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await axios.delete(`http://localhost:5000/api/creator/${id}`);
        fetchData();
        fetchInvestmentSummary();
      } catch (error) {
        console.error('Error deleting company:', error);
      }
    }
  };

  const handleEdit = (entry) => {
    setCompany(entry.company);
    setIdea(entry.idea);
    setAmount(entry.amount);
    setEditingId(entry._id);
    setActiveTab('add');
  };

  const handleView = (entry) => {
    setSelectedCompany(entry);
    setShowViewModal(true);
  };

  useEffect(() => {
    if (userInfo) {
      fetchData();
      fetchInvestmentSummary();
    }
  }, [userInfo]);

  const getTotalInvested = (companyName) => {
    const found = investmentSummary.find((item) => item.company === companyName);
    return found ? found.totalInvested : 0;
  };

  const getProgressPercentage = (companyName, targetAmount) => {
    const invested = getTotalInvested(companyName);
    return invested > 0 ? Math.min((invested / targetAmount) * 100, 100) : 0;
  };

  // Show loading if user info is not loaded yet
  if (!userInfo) {
    return (
      <div className="creator-page">
        <div className="creator-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="creator-page">
      <div className="creator-container">
        {/* Header Section */}
        <div className="creator-header">
          <div className="header-content">
            <h1 className="page-title">Creator Dashboard</h1>
            <p className="page-subtitle">Welcome back, {userInfo.username}! Manage your companies and track investments</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{data.length}</span>
              <span className="stat-label">Your Companies</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">₹{data.reduce((sum, item) => sum + parseInt(item.amount || 0), 0).toLocaleString()}</span>
              <span className="stat-label">Total Funding Goal</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">₹{investmentSummary.reduce((sum, item) => sum + item.totalInvested, 0).toLocaleString()}</span>
              <span className="stat-label">Total Raised</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="action-section">
          <button 
            className={`action-button ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            {editingId ? 'Edit Company' : 'Add New Company'}
          </button>
          {activeTab === 'add' && (
            <button 
              className="cancel-button"
              onClick={() => {
                setActiveTab('view');
                setEditingId(null);
                setCompany('');
                setIdea('');
                setAmount('');
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {activeTab === 'add' && (
          <div className="form-section">
            <div className="form-card">
              <h2 className="form-title">{editingId ? 'Edit Company' : 'Add New Company'}</h2>
              <form onSubmit={handleSubmit} className="creator-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="company">Company Name</label>
                    <input
                      id="company"
                      type="text"
                      placeholder="Enter company name"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="idea">Business Idea</label>
                  <textarea
                    id="idea"
                    placeholder="Describe your business idea"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    required
                    className="form-textarea"
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="amount">Funding Goal (₹)</label>
                  <input
                    id="amount"
                    type="number"
                    placeholder="Enter amount needed"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner"></span>
                        {editingId ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      editingId ? 'Update Company' : 'Add Company'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Companies Table */}
        {activeTab === 'view' && (
          <div className="table-section">
            <div className="table-header">
              <h2 className="table-title">Your Companies</h2>
              <p className="table-subtitle">Track your companies and investment progress</p>
            </div>
            
            {data.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🏢</div>
                <h3>No Companies Yet</h3>
                <p>Start by adding your first company to begin fundraising</p>
                <button 
                  className="add-first-button"
                  onClick={() => setActiveTab('add')}
                >
                  Add Your First Company
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="creator-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Idea</th>
                      <th>Creator</th>
                      <th>Goal</th>
                      <th>Raised</th>
                      <th>Progress</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((entry) => {
                      const totalInvested = getTotalInvested(entry.company);
                      const progress = getProgressPercentage(entry.company, entry.amount);
                      
                      return (
                        <tr key={entry._id}>
                          <td className="company-cell">
                            <div className="company-info">
                              <strong>{entry.company}</strong>
                            </div>
                          </td>
                          <td className="idea-cell">
                            <div className="idea-text">{entry.idea}</div>
                          </td>
                          <td>{entry.name}</td>
                          <td className="amount-cell">₹{parseInt(entry.amount).toLocaleString()}</td>
                          <td className="invested-cell">₹{totalInvested.toLocaleString()}</td>
                          <td className="progress-cell">
                            <div className="progress-bar">
                              <div 
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="progress-text">{progress.toFixed(1)}%</span>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <button 
                                onClick={() => handleView(entry)}
                                className="action-btn view-btn"
                                title="View Details"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => handleEdit(entry)}
                                className="action-btn edit-btn"
                                title="Edit Company"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(entry._id)}
                                className="action-btn delete-btn"
                                title="Delete Company"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedCompany && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Company Details</h2>
            <p><strong>Company:</strong> {selectedCompany.company}</p>
            <p><strong>Idea:</strong> {selectedCompany.idea}</p>
            <p><strong>Creator:</strong> {selectedCompany.name}</p>
            <p><strong>Amount Needed:</strong> ₹{selectedCompany.amount}</p>
            <p><strong>Total Invested:</strong> ₹{getTotalInvested(selectedCompany.company)}</p>
            <p><strong>Progress:</strong> {getProgressPercentage(selectedCompany.company, selectedCompany.amount).toFixed(1)}%</p>
            <button onClick={() => setShowViewModal(false)} className="modal-close-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatorPage;
