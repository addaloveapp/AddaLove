import { useEffect, useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Loader, 
  Mail, 
  Smartphone, 
  Verified, 
  Lock, 
  Globe, 
  ChevronDown, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { handleSuccess } from '../components/ErrorMessage';
import cooladday from "../assets/cooladday.png"
export default function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [errors, setErrors] = useState({});
  const naviget = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL2 || import.meta.env.VITE_BACKEND_URL;
  const supportMessage = 'Your account does not have a gmail contact our support team ph no : 7362999841';

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const parseResponse = async (response) => {
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Something went wrong. Try again.');
    }
    return data;
  };

  const handleFindUser = async () => {
    const cleanedPhone = phoneNumber.trim();
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(cleanedPhone)) {
      setErrors({ phoneNumber: 'Please enter a valid 10-digit Indian mobile number.' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/auth/v1/find-user-for-forget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: cleanedPhone }),
      });
      const data = await parseResponse(response);

      if (!data.data) {
        setEmail('');
        setSelectedEmail('');
        setErrors({ email: supportMessage });
        setStep(2);
        return;
      }

      setEmail(data.data);
      setSelectedEmail(data.data);
      setErrors({});
      setStep(2);
    } catch (error) {
      setErrors({ phoneNumber: error.message || 'User not found.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!selectedEmail) {
      setErrors({ email: 'Please select Gmail to send OTP.' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/auth/v1/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: selectedEmail, purpose: 'forget-password' }),
      });
      const data = await parseResponse(response);
      setReferenceCode(data.data.referenceCode);
      setOtp('');
      setTimer(120);
      setErrors({});
      setStep(3);
    } catch (error) {
      setErrors({ email: error.message || 'Failed to send OTP.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP.' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/auth/v1/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, referenceCode }),
      });
      await parseResponse(response);
      setErrors({});
      setStep(4);
    } catch (error) {
      setErrors({ otp: error.message || 'Invalid OTP.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters.';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/auth/v1/forget-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: selectedEmail, newPassword }),
      });
      await parseResponse(response);
      handleSuccess('Password has been changed!');
      naviget('/login');
    } catch (error) {
      setErrors({ submit: error.message || 'Password change failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0014] text-slate-100 flex flex-col items-center py-6 px-4 font-sans relative overflow-x-hidden">
      
      {/* Ambient Background Glow (Static) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <div className="absolute top-[10%] w-[500px] h-[500px] bg-[#FF2994] rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>
        <div className="absolute bottom-[-10%] w-[400px] h-[400px] bg-[#8B2BFF] rounded-full mix-blend-screen filter blur-[150px] opacity-15"></div>
      </div>

      <div className="relative w-full max-w-md flex flex-col items-center z-10">
        
        {/* Header Section */}
        <div className="w-full flex justify-between items-center mb-4 px-2">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight">
              Adda<span className="text-[#FF2994]">Love</span>
            </h1>
            <p className="text-[10px] text-slate-300 mt-0.5">Account <span className="text-[#FF2994]">Recovery</span></p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 transition">
            <Globe className="w-3.5 h-3.5" />
            English
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hero Character Image (Hide on final step to save space) */}
        {step < 4 && (
          <div className="relative w-full flex justify-center mb-6 animate-fadeIn">
            <img 
              src={cooladday} 
              alt="AddaLove Mascot" 
              className="w-48 h-auto drop-shadow-[0_0_25px_rgba(255,41,148,0.4)] transition-all duration-500"
            />
          </div>
        )}

        {/* Main Card */}
        <div className="w-full bg-[#150A2A]/90 backdrop-blur-xl border border-white/5 rounded-4xl p-6 shadow-2xl">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-1">
              {step === 1 && "Find Account"}
              {step === 2 && "Recovery Method"}
              {step === 3 && "Verify OTP"}
              {step === 4 && "Reset Password"}
            </h2>
            <p className="text-slate-400 text-sm">
              {step === 1 && "Enter your phone number to continue"}
              {step === 2 && "Select your email to receive a code"}
              {step === 3 && "Enter the 6-digit code sent to your email"}
              {step === 4 && "Create a new secure password"}
            </p>
          </div>

          {/* STEP 1: Phone Search */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <div className="flex items-center bg-[#1C1035] border border-white/5 rounded-2xl px-4 py-3.5 focus-within:border-[#FF2994]/50 transition-colors">
                  <Smartphone className="w-5 h-5 text-[#FF2994] shrink-0" />
                  <input
                    type="number"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (errors.phoneNumber) setErrors({});
                    }}
                    placeholder="Phone Number"
                    className="w-full bg-transparent text-white placeholder-slate-500 ml-3 outline-none text-sm disabled:opacity-50"
                    disabled={loading}
                  />
                  <div className="flex items-center text-slate-400 text-sm border-l border-white/10 pl-3 ml-2 shrink-0">
                    +91 <ChevronDown className="w-4 h-4 ml-1" />
                  </div>
                </div>
                {errors.phoneNumber && <p className="text-red-400 text-xs mt-1.5 px-2">{errors.phoneNumber}</p>}
              </div>

              <button 
                onClick={handleFindUser} 
                disabled={loading || !phoneNumber} 
                className="w-full py-4 bg-linear-to-r from-[#FF2994] to-[#8B2BFF] text-white font-bold rounded-full hover:shadow-[0_0_20px_rgba(255,41,148,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-2"
              >
                {loading ? <><Loader className="w-4 h-4 animate-spin" /> Checking...</> : <><SearchIcon className="w-4 h-4" /> Find Account</>}
              </button>
            </div>
          )}

          {/* STEP 2: Email Selection */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              {email ? (
                <>
                  <button 
                    type="button" 
                    onClick={() => setSelectedEmail(email)} 
                    className={`w-full p-4 border rounded-2xl text-left transition-all duration-300 ${selectedEmail === email ? 'border-[#FF2994] bg-[#2A0845] shadow-[0_0_15px_rgba(255,41,148,0.2)]' : 'border-white/10 bg-[#1C1035] hover:bg-[#251545]'}`}
                  >
                    <span className="flex items-center gap-3 text-sm font-semibold text-slate-100">
                      <div className={`p-2 rounded-full ${selectedEmail === email ? 'bg-[#FF2994]/20' : 'bg-white/5'}`}>
                        <Mail className={`w-5 h-5 ${selectedEmail === email ? 'text-[#FF2994]' : 'text-slate-400'}`} />
                      </div>
                      <span className="truncate">{email}</span>
                      {selectedEmail === email && <Verified className="w-5 h-5 text-green-400 ml-auto shrink-0" />}
                    </span>
                  </button>
                  {errors.email && <p className="text-red-400 text-xs px-2">{errors.email}</p>}
                  <button 
                    onClick={handleSendOtp} 
                    disabled={loading || !selectedEmail} 
                    className="w-full py-4 bg-linear-to-r from-[#FF2994] to-[#8B2BFF] text-white font-bold rounded-full hover:shadow-[0_0_20px_rgba(255,41,148,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-4"
                  >
                    {loading ? <><Loader className="w-4 h-4 animate-spin" /> Sending...</> : <><Sparkles className="w-4 h-4" /> Send OTP Code</>}
                  </button>
                </>
              ) : (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                  <p className="text-red-300 text-sm leading-relaxed">{errors.email || supportMessage}</p>
                </div>
              )}
              
              <button 
                type="button" 
                onClick={() => { setStep(1); setErrors({}); }} 
                className="w-full py-2 text-slate-400 hover:text-white transition-colors text-xs font-medium"
              >
                Go Back
              </button>
            </div>
          )}

          {/* STEP 3: OTP Verification */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <div className="flex items-center bg-[#1C1035] border border-white/5 rounded-2xl px-4 py-4 focus-within:border-[#FF2994]/50 transition-colors">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                      if (errors.otp) setErrors({});
                    }}
                    placeholder="••••••"
                    maxLength="6"
                    className="w-full bg-transparent text-white placeholder-slate-600 text-center text-3xl tracking-[0.5em] font-bold outline-none disabled:opacity-50"
                    disabled={loading}
                  />
                </div>
                {errors.otp && <p className="text-red-400 text-xs mt-1.5 px-2 text-center">{errors.otp}</p>}
              </div>
              
              <button 
                onClick={handleVerifyOtp} 
                disabled={loading || otp.length !== 6} 
                className="w-full py-4 bg-linear-to-r from-[#FF2994] to-[#8B2BFF] text-white font-bold rounded-full hover:shadow-[0_0_20px_rgba(255,41,148,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {loading ? <><Loader className="w-4 h-4 animate-spin" /> Verifying...</> : <><Verified className="w-4 h-4" /> Verify OTP</>}
              </button>
              
              <div className="text-center flex justify-between items-center px-2">
                <button type="button" onClick={() => { setStep(2); setOtp(''); setErrors({}); }} className="text-xs text-slate-400 hover:text-white transition-colors font-medium">Change Email</button>
                {timer > 0 ? (
                  <span className="text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full">Resend in {timer}s</span>
                ) : (
                  <button type="button" onClick={handleSendOtp} className="text-xs text-[#FF2994] hover:text-[#FF66AD] transition-colors font-medium">Resend OTP</button>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: New Password */}
          {step === 4 && (
            <form onSubmit={handleChangePassword} className="space-y-4 animate-fadeIn">
              <div>
                <div className="flex items-center bg-[#1C1035] border border-white/5 rounded-2xl px-4 py-3.5 focus-within:border-[#FF2994]/50 transition-colors">
                  <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={newPassword} 
                    onChange={(e) => { setNewPassword(e.target.value); if (errors.newPassword) setErrors({}); }} 
                    placeholder="New Password" 
                    className="w-full bg-transparent text-white placeholder-slate-500 ml-3 outline-none text-sm disabled:opacity-50" 
                    disabled={loading}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-500 hover:text-white transition-colors shrink-0 ml-2">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-400 text-xs mt-1.5 px-2">{errors.newPassword}</p>}
              </div>

              <div>
                <div className="flex items-center bg-[#1C1035] border border-white/5 rounded-2xl px-4 py-3.5 focus-within:border-[#FF2994]/50 transition-colors">
                  <Lock className="w-5 h-5 text-slate-400 shrink-0" />
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    value={confirmPassword} 
                    onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors({}); }} 
                    placeholder="Confirm Password" 
                    className="w-full bg-transparent text-white placeholder-slate-500 ml-3 outline-none text-sm disabled:opacity-50" 
                    disabled={loading}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-slate-500 hover:text-white transition-colors shrink-0 ml-2">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5 px-2">{errors.confirmPassword}</p>}
              </div>

              {errors.submit && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                  <p className="text-red-400 text-xs">{errors.submit}</p>
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full mt-2 py-4 bg-linear-to-r from-[#FF2994] to-[#8B2BFF] text-white font-bold rounded-full hover:shadow-[0_0_20px_rgba(255,41,148,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {loading ? <><Loader className="w-4 h-4 animate-spin" /> Saving...</> : 'Save New Password'}
              </button>
            </form>
          )}

          {/* Login Link Card (Always visible at the bottom) */}
          <Link 
            to="/login"
            className="mt-6 flex items-center justify-between w-full bg-[#1A0B2E] border border-white/5 hover:border-[#8B2BFF]/30 rounded-2xl p-4 transition-colors group cursor-pointer"
          >
            <span className="text-sm text-slate-300">
              Remembered your password? <span className="text-[#8B2BFF] font-medium group-hover:text-[#A75CFF] transition-colors">Login</span>
            </span>
            <div className="w-7 h-7 rounded-full bg-[#2A1545] flex items-center justify-center group-hover:bg-[#8B2BFF]/20 transition-colors">
              <ArrowRight className="w-4 h-4 text-[#8B2BFF]" />
            </div>
          </Link>

        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 justify-center mt-6 z-10">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === step 
                  ? 'bg-linear-to-r from-[#FF2994] to-[#8B2BFF] w-8 shadow-[0_0_10px_rgba(255,41,148,0.5)]' 
                  : i < step 
                    ? 'bg-[#8B2BFF]/50 w-4' 
                    : 'bg-white/10 w-4'
              }`} 
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        /* Hide number input spinners */
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type='number'] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}

// Inline component for the Search icon 
function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}