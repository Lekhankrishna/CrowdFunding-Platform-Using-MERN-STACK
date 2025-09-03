import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Page.css';

function InvestorPage() {
  const [investor, setInvestor] = useState('');
  const [money, setMoney] = useState('');
  const [creatorData, setCreatorData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentStep, setPaymentStep] = useState('form'); // 'form', 'processing', 'success'
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewModalCompany, setViewModalCompany] = useState(null);

  const fetchCreatorData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/creator');
      setCreatorData(res.data);
    } catch (error) {
      console.error('Error fetching creator data:', error);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentStep('processing');
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        await axios.post('http://localhost:5000/api/investor', {
          investor,
          company: selectedCompany.company,
          money
        });
        setPaymentStep('success');
        setTimeout(() => {
          setInvestor('');
          setMoney('');
          setSelectedCompany(null);
          setShowPaymentForm(false);
          setPaymentStep('form');
          setCardDetails({
            cardNumber: '',
            cardHolder: '',
            expiryDate: '',
            cvv: ''
          });
        }, 2000);
      } catch (err) {
        alert('Payment failed. Please try again.');
        setPaymentStep('form');
      }
    }, 2000);
  };

  const handleInvestClick = (company) => {
    setSelectedCompany(company);
    setShowPaymentForm(true);
    setPaymentStep('form');
  };

  const handleView = (entry) => {
    setViewModalCompany(entry);
    setShowViewModal(true);
  };

  useEffect(() => {
    fetchCreatorData();
  }, []);

  return (
    <div className="investor-page">
      <div className="investor-container">
        {/* Header Section */}
        <div className="investor-header">
          <div className="header-content">
            <h1 className="page-title">Investor Dashboard</h1>
            <p className="page-subtitle">Discover and invest in innovative business ideas</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{creatorData.length}</span>
              <span className="stat-label">Available Opportunities</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">₹{creatorData.reduce((sum, item) => sum + parseInt(item.amount || 0), 0).toLocaleString()}</span>
              <span className="stat-label">Total Funding Goals</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{creatorData.filter(item => parseInt(item.amount) > 0).length}</span>
              <span className="stat-label">Active Campaigns</span>
            </div>
          </div>
        </div>

        {/* Investment Opportunities Section */}
        <div className="opportunities-section">
          <div className="section-header">
            <h2 className="section-title">Investment Opportunities</h2>
            <p className="section-subtitle">Browse through innovative business ideas and support creators</p>
          </div>
          
          {creatorData.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💡</div>
              <h3>No Opportunities Available</h3>
              <p>Check back later for new investment opportunities from creators</p>
            </div>
          ) : (
            <div className="opportunities-grid">
              {creatorData.map((entry) => (
                <div key={entry._id} className="opportunity-card">
                  <div className="card-header">
                    <h3 className="company-name">{entry.company}</h3>
                    <span className="creator-name">by {entry.name}</span>
                  </div>
                  
                  <div className="card-content">
                    <p className="idea-description">{entry.idea}</p>
                    
                    <div className="funding-info">
                      <div className="funding-goal">
                        <span className="label">Funding Goal</span>
                        <span className="amount">₹{parseInt(entry.amount).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      onClick={() => handleView(entry)}
                      className="action-btn view-btn"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleInvestClick(entry)}
                      className="action-btn invest-btn"
                    >
                      Invest Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PAYMENT FORM */}
        {showPaymentForm && selectedCompany && (
          <div className="payment-form-overlay">
            <div className="payment-form">
              {paymentStep === 'form' && (
                <>
                  <h3>Complete Your Investment</h3>
                  <div className="investment-summary">
                    <h4>Investment Summary</h4>
                    <p><strong>Company:</strong> {selectedCompany.company}</p>
                    <p><strong>Idea:</strong> {selectedCompany.idea}</p>
                    <p><strong>Creator:</strong> {selectedCompany.name}</p>
                    <p><strong>Amount Needed:</strong> ₹{selectedCompany.amount}</p>
                  </div>
                  
                  <form onSubmit={handlePaymentSubmit}>
                    <div className="form-group">
                      <label>Your Name</label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={investor}
                        onChange={(e) => setInvestor(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Investment Amount (₹)</label>
                      <input
                        type="number"
                        placeholder="Enter amount to invest"
                        value={money}
                        onChange={(e) => setMoney(e.target.value)}
                        required
                      />
                    </div>

                    <div className="payment-details">
                      <h4>Payment Details</h4>
                      
                      <div className="form-group">
                        <label>Card Number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                          maxLength="19"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Card Holder Name</label>
                        <input
                          type="text"
                          placeholder="JOHN DOE"
                          value={cardDetails.cardHolder}
                          onChange={(e) => setCardDetails({...cardDetails, cardHolder: e.target.value})}
                          required
                        />
                      </div>

                      <div className="card-row">
                        <div className="form-group">
                          <label>Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardDetails.expiryDate}
                            onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                            maxLength="5"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                            maxLength="4"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="button-group">
                      <button type="submit" className="pay-button">
                        Pay ₹{money || 0}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowPaymentForm(false)}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              )}

              {paymentStep === 'processing' && (
                <div className="processing">
                  <h3>Processing Payment...</h3>
                  <div className="spinner"></div>
                  <p>Please wait while we process your investment</p>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="success">
                  <h3>Payment Successful! 🎉</h3>
                  <p>Your investment of ₹{money} has been processed successfully.</p>
                  <p>Thank you for supporting {selectedCompany.company}!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW DETAILS MODAL */}
        {showViewModal && viewModalCompany && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Company Details</h2>
              <p><strong>Company:</strong> {viewModalCompany.company}</p>
              <p><strong>Idea:</strong> {viewModalCompany.idea}</p>
              <p><strong>Creator:</strong> {viewModalCompany.name}</p>
              <p><strong>Amount Needed:</strong> ₹{viewModalCompany.amount}</p>
              <button onClick={() => setShowViewModal(false)} className="modal-close-button">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvestorPage;
