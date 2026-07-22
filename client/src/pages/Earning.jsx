import React, { useState } from 'react';
import { ArrowLeft, Wallet, Building2, History, ChevronRight } from 'lucide-react';
import ladday from "../assets/ladday.png";
import '../styles/WithdrawPage.css'; 

const Earning = () => {
  const [amount, setAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank');

  const handleQuickAmount = (value) => {
    setAmount(value);
  };

  return (
    <div className="withdraw-wrapper">
      {/* Background sparkles */}
      <div className="sparkle top-left"></div>
      <div className="sparkle top-right"></div>
      
      <div className="withdraw-content">
        {/* Header Nav */}
        <header className="top-nav">
          <button className="icon-btn">
            <ArrowLeft size={20} />
          </button>
          <h1 className="nav-title">Withdraw</h1>
          <button className="icon-btn">
            <History size={20} />
          </button>
        </header>

        {/* Balance Section with Ladday Model */}
        <div className="balance-section">
          <img src={ladday} alt="Decorative" className="ladday-bg" />
          <div className="balance-card">
            <span className="balance-label">Available Balance</span>
            <div className="balance-amount">
              <span className="currency-symbol">$</span>
              <span className="amount">1,250.00</span>
            </div>
            <span className="respect-points">Equivalent to 12,500 Respect Points</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="input-section">
          <label className="input-label">Enter Amount</label>
          <div className="amount-input-wrapper">
            <span className="input-currency">$</span>
            <input 
              type="number" 
              className="amount-input" 
              placeholder="0.00" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
            />
          </div>
          
          <div className="quick-amounts">
            <button className="quick-btn" onClick={() => handleQuickAmount('10')}>$10</button>
            <button className="quick-btn" onClick={() => handleQuickAmount('50')}>$50</button>
            <button className="quick-btn" onClick={() => handleQuickAmount('100')}>$100</button>
            <button className="quick-btn" onClick={() => handleQuickAmount('1250')}>MAX</button>
          </div>
        </div>

        {/* Withdrawal Methods */}
        <div className="method-section">
          <label className="input-label">Withdrawal Method</label>
          <div className="method-options">
            
            <div 
              className={`method-card ${withdrawMethod === 'bank' ? 'active-bank' : ''}`}
              onClick={() => setWithdrawMethod('bank')}
            >
              <div className="method-icon blue-glow">
                <Building2 size={24} />
              </div>
              <div className="method-info">
                <span className="method-name">Bank Transfer</span>
                <span className="method-desc">Takes 2-3 business days</span>
              </div>
              <ChevronRight size={20} className="chevron" />
            </div>

            <div 
              className={`method-card ${withdrawMethod === 'upi' ? 'active-upi' : ''}`}
              onClick={() => setWithdrawMethod('upi')}
            >
              <div className="method-icon pink-glow">
                <Wallet size={24} />
              </div>
              <div className="method-info">
                <span className="method-name">UPI / E-Wallet</span>
                <span className="method-desc">Instant transfer</span>
              </div>
              <ChevronRight size={20} className="chevron" />
            </div>

          </div>
        </div>

        {/* Submit Button */}
        <button className="withdraw-submit-btn">
          Proceed to Withdraw
        </button>
      </div>
    </div>
  );
};

export default Earning;