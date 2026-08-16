import { useEffect, useState } from 'react';
import {
  Info,
  ChevronRight,
  Building2,
  CheckCircle2,
  Circle,
  ShieldCheck,
  Clock,
  Receipt,
  ArrowRight,
  BadgeCheck,
  Zap,
  Coins
} from 'lucide-react';
import '../styles/WithdrawPage.css';
import earning from '../assets/earning.png';
import useUserStore from '../store/userStore';
import { handleError, handleSuccess } from '../components/ErrorMessage';
import playSound from '../utils/playSound';
import girlCoinWithdrawalSound from '../assets/sounds/girlCoinWithdrawal.aac';
import coin1 from "../assets/coin1.png"
const Earning = () => {
  const [amount, setAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank');
  const [upiId, setUpiId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [successApplicationId, setSuccessApplicationId] = useState('');
  const { user: useralldata, userRole, fetchUser } = useUserStore();

  const handleQuickAmount = (value) => {
    setAmount(value);
  };

  function coinToMoney(coins) {
    const ratePerCoin = 0.09;
    return (coins * ratePerCoin).toFixed(2);
  }

  function moneyToCoins(value) {
    return Math.ceil(Number(value || 0) / 0.09);
  }

  const fetchWithdrawHistory = async () => {
    if (userRole !== 'girl') return;

    setIsHistoryLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/v1/withdraw-history`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Unable to load withdrawal history');
      }

      setWithdrawHistory(data.data || []);
    } catch (error) {
      handleError(error.message || 'Unable to load withdrawal history');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWithdrawHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  const handleWithdraw = async () => {
    const withdrawAmount = Number(amount);
    const availableAmount = Number(coinToMoney(useralldata?.walletBlance || 0));

    if (userRole !== 'girl') {
      handleError('Only girls can withdraw earnings');
      return;
    }

    if (!withdrawAmount || withdrawAmount < 100) {
      handleError('Minimum withdrawal amount is Rs. 100');
      return;
    }

    if (withdrawAmount > availableAmount) {
      handleError('Not enough coins to withdraw this amount');
      return;
    }

    if (withdrawMethod === 'upi' && !upiId.trim()) {
      handleError('Please enter your UPI ID');
      return;
    }

    if (withdrawMethod === 'bank' && (!accountNumber.trim() || !ifscCode.trim())) {
      handleError('Please enter account number and IFSC code');
      return;
    }

    setIsWithdrawLoading(true);
    try {
      const payload = {
        userId: useralldata?._id,
        withdrawAmount,
        withdrawMethod,
        ...(withdrawMethod === 'upi'
          ? { upiId: upiId.trim() }
          : { accountNumber: accountNumber.trim(), ifscCode: ifscCode.trim() })
      };

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/v1/withdraw-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Withdrawal request failed');
      }

      playSound(girlCoinWithdrawalSound);
      handleSuccess('Withdrawal request successful!');
      setSuccessApplicationId(data.data?.applicationId || '');
      setAmount('');
      setUpiId('');
      setAccountNumber('');
      setIfscCode('');
      await fetchUser();
      await fetchWithdrawHistory();
    } catch (error) {
      handleError(error.message || 'Withdrawal request failed');
    } finally {
      setIsWithdrawLoading(false);
    }
  };

  return (
    <div className="withdraw-wrapper">
      {/* Spacer for external Navbar */}
      <div className="navbar-spacer"></div>

      <div className="withdraw-content">

        {/* Header Section */}
        <div className="header-section">
          <div className="header-text">
            <h1 className="page-title">
              Withdraw Earnings <BadgeCheck size={20} className="title-badge" fill="#9b4dff" color="#0a0514" />
            </h1>
            <p className="page-subtitle">Your earnings, your rules. Withdraw anytime!</p>
          </div>
          {/* Top right image placeholder for wallet illustration */}
          <div className="header-image-container">
            <img
              src={earning}
              alt="Wallet"
              className="wallet-illustration"
            />
          </div>
        </div>

        {/* Balance Card */}
        <div className="balance-card">
          <span className="balance-label">AVAILABLE BALANCE</span>
          <div className="balance-amount">
            <span className="currency-symbol">₹</span>
            <span className="amount">{coinToMoney(useralldata?.walletBlance)}</span>
          </div>
          <div className="respect-points-pill">
            <span>= {(useralldata?.walletBlance || 0).toLocaleString()} Respect Points</span>
            <Info size={14} className="info-icon" />
          </div>
        </div>

        {/* NEW: Coin Exchange Rate Section */}
        <div className="exchange-rate-banner">
          <img src={coin1} className='h-6' alt="" />1
          <span className="rate-text">= ₹0.09</span>
        </div>

        {/* Amount Input */}
        <div className="input-section">
          <label className="section-label">ENTER AMOUNT</label>
          <div className="amount-input-wrapper">
            <span className="input-currency">₹</span>
            <input
              type="number"
              className="amount-input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isWithdrawLoading}
            />
          </div>
          {!!amount && (
            <div className="coin-withdraw-value">
              <Coins size={14} />
              <span>{moneyToCoins(amount).toLocaleString()} coins will be deducted</span>
            </div>
          )}
          <div className="min-withdrawal">
            <ShieldCheck size={14} className="min-icon" />
            <span>Minimum withdrawal amount: ₹100</span>
          </div>

          <div className="quick-amounts">
            <button className="quick-btn" onClick={() => handleQuickAmount('100')}>₹100</button>
            <button className="quick-btn" onClick={() => handleQuickAmount('200')}>₹200</button>
            <button className="quick-btn" onClick={() => handleQuickAmount('500')}>₹500</button>
            <button className="quick-btn" onClick={() => handleQuickAmount('1000')}>₹1,000</button>
            <button className="quick-btn" onClick={() => handleQuickAmount('2000')}>₹2,000</button>
       
          </div>
        </div>

        {/* Withdrawal Methods */}
        <div className="method-section">
          <label className="section-label">WITHDRAWAL METHOD</label>

          <div className="method-options">
            {/* Bank Transfer Option */}
            <div
              className={`method-card ${withdrawMethod === 'bank' ? 'active' : ''}`}
              onClick={() => setWithdrawMethod('bank')}
            >
              <div className="method-icon-wrapper">
                <Building2 size={24} className="method-icon" />
              </div>
              <div className="method-info">
                <div className="method-name-row">
                  <span className="method-name">Bank Transfer</span>
                  <span className="recommended-badge">Recommended</span>
                </div>
                <span className="method-desc">Direct to your bank account</span>
                <span className="method-time"><Clock size={12} /> Takes 1-3 business days</span>
              </div>
              <div className="method-action">
                {withdrawMethod === 'bank' ? (
                  <div className="check-circle active"><CheckCircle2 size={20} fill="#ff4d94" color="#0a0514" /></div>
                ) : (
                  <ChevronRight size={20} className="chevron" />
                )}
              </div>
            </div>

            {/* UPI Option */}
            <div
              className={`method-card ${withdrawMethod === 'upi' ? 'active' : ''}`}
              onClick={() => setWithdrawMethod('upi')}
            >
              <div className="method-icon-wrapper upi-icon">
                <div className="upi-logo-placeholder"></div>
              </div>
              <div className="method-info">
                <span className="method-name">UPI / E-Wallet</span>
                <span className="method-desc">Instant transfer to UPI ID</span>
                <span className="method-time"><Zap size={12} /> Instant Transfer</span>
              </div>
              <div className="method-action">
                {withdrawMethod === 'upi' ? (
                  <div className="check-circle active"><CheckCircle2 size={20} fill="#ff4d94" color="#0a0514" /></div>
                ) : (
                  <Circle size={20} className="circle-outline" />
                )}
                {withdrawMethod !== 'upi' && <ChevronRight size={20} className="chevron" />}
              </div>
            </div>
          </div>
        </div>

        <div className="payout-details-section">
          <label className="section-label">{withdrawMethod === 'upi' ? 'UPI DETAILS' : 'BANK DETAILS'}</label>

          {withdrawMethod === 'upi' ? (
            <input
              type="text"
              className="withdraw-detail-input"
              placeholder="example@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              disabled={isWithdrawLoading}
            />
          ) : (
            <div className="bank-input-grid">
              <input
                type="text"
                className="withdraw-detail-input"
                placeholder="Account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                disabled={isWithdrawLoading}
              />
              <input
                type="text"
                className="withdraw-detail-input"
                placeholder="IFSC code"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                disabled={isWithdrawLoading}
              />
            </div>
          )}
        </div>

        {/* Features Footer Section */}
        <div className="features-section">
          <div className="feature-item">
            <div className="feature-icon secure"><ShieldCheck size={18} /></div>
            <div className="feature-text">
              <h4>100% Secure</h4>
              <p>Your transactions are fully protected</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon fast"><Clock size={18} /></div>
            <div className="feature-text">
              <h4>Quick Processing</h4>
              <p>Get your money within 1-3 days</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon free"><Receipt size={18} /></div>
            <div className="feature-text">
              <h4>No Hidden Charges</h4>
              <p>What you earn, you receive</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button className="withdraw-submit-btn" onClick={handleWithdraw} disabled={isWithdrawLoading}>
          {isWithdrawLoading ? 'SUBMITTING REQUEST...' : 'PROCEED TO WITHDRAW'}
          <div className="btn-arrow">
            {isWithdrawLoading ? <Clock size={18} /> : <ArrowRight size={18} />}
          </div>
        </button>

        <div className="withdraw-history-section">
          <div className="history-heading-row">
            <div>
              <label className="section-label">WITHDRAWAL HISTORY</label>
              <p>Track your application ID and payment status</p>
            </div>
          </div>

          {isHistoryLoading ? (
            <div className="history-skeleton-list">
              <div className="history-skeleton"></div>
              <div className="history-skeleton"></div>
              <div className="history-skeleton"></div>
            </div>
          ) : withdrawHistory.length > 0 ? (
            <div className="history-list">
              {withdrawHistory.map((request) => (
                <div className="history-card" key={request._id || request.applicationId}>
                  <div>
                    <span className="history-application-id">#{request.applicationId}</span>
                    <span className="history-method">{request.withdrawMethod === 'upi' ? 'UPI' : 'Bank'}</span>
                  </div>
                  <div className="history-right">
                    <strong>₹{Number(request.withdrawAmount || 0).toFixed(2)}</strong>
                    <span className={`history-status ${request.action === 'send' ? 'send' : 'pending'}`}>
                      {request.action === 'send' ? 'Send' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-history">No withdrawal requests yet.</div>
          )}
        </div>

        {successApplicationId && (
          <div className="withdraw-popup-backdrop">
            <div className="withdraw-popup">
              <CheckCircle2 size={44} className="popup-success-icon" />
              <h3>Request Pending</h3>
              <p>Your withdrawal application #{successApplicationId} is pending. You can have your money within 24 hours.</p>
              <button onClick={() => setSuccessApplicationId('')}>OKAY</button>
            </div>
          </div>
        )}

        {/* Spacer for external Footer */}
        <div className="footer-spacer"></div>
      </div>
    </div>
  );
};

export default Earning;
