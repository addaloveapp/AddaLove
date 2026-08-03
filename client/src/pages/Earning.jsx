import React, { useState } from 'react';
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

const Earning = () => {
  const [amount, setAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank');
  const { user: useralldata, userRole } = useUserStore();

  const handleQuickAmount = (value) => {
    setAmount(value);
  };

  function coinToMoney(coins) {
    const ratePerCoin = 0.09;
    return (coins * ratePerCoin).toFixed(2);
  }
  const handleWithdraw = () => {
    const withdrawAmount = Number(amount);
    const availableAmount = Number(coinToMoney(useralldata?.walletBlance || 0));

    if (userRole !== 'girl') {
      handleError('Only girls can withdraw earnings');
      return;
    }

    if (!withdrawAmount || withdrawAmount < 200) {
      handleError('Minimum withdrawal amount is Rs. 200');
      return;
    }

    if (withdrawAmount > availableAmount) {
      handleError('Not enough coins to withdraw this amount');
      return;
    }

    playSound(girlCoinWithdrawalSound);
    handleSuccess('Withdrawal request successful!');
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
            <span>= 12,500 Respect Points</span>
            <Info size={14} className="info-icon" />
          </div>
        </div>

        {/* NEW: Coin Exchange Rate Section */}
        <div className="exchange-rate-banner">
          <span className="rate-text">🪙1</span>
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
            />
          </div>
          <div className="min-withdrawal">
            <ShieldCheck size={14} className="min-icon" />
            <span>Minimum withdrawal amount: ₹200</span>
          </div>

          <div className="quick-amounts">
            <button className="quick-btn" onClick={() => handleQuickAmount('200')}>₹200</button>
            <button className="quick-btn" onClick={() => handleQuickAmount('500')}>₹500</button>
            <button className="quick-btn" onClick={() => handleQuickAmount('1000')}>₹1,000</button>
            <button className="quick-btn" onClick={() => handleQuickAmount('2000')}>₹2,000</button>
            <button className="quick-btn max-btn" onClick={() => handleQuickAmount('1250')}>MAX</button>
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
        <button className="withdraw-submit-btn" onClick={handleWithdraw}>
          PROCEED TO WITHDRAW
          <div className="btn-arrow">
            <ArrowRight size={18} />
          </div>
        </button>

        {/* Spacer for external Footer */}
        <div className="footer-spacer"></div>
      </div>
    </div>
  );
};

export default Earning;
