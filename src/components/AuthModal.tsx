import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Smartphone, 
  Mail, 
  QrCode, 
  CheckCircle2, 
  X, 
  ArrowRight,
  UserCheck,
  Building,
  Info
} from 'lucide-react';
import { UserProfile, AuthState } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | '2fa_verify' | '2fa_setup'>('login');
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState(currentUser.name);
  const [company, setCompany] = useState(currentUser.companyName);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'authenticator' | 'sms' | 'email'>(
    currentUser.twoFactorMethod || 'authenticator'
  );
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.charAt(value.length - 1);
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input field
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address');
      return;
    }
    setErrorMsg('');
    if (currentUser.is2FAEnabled) {
      setMode('2fa_verify');
      setSuccessMsg('2FA Code required. Enter the 6-digit verification code.');
    } else {
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1000);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !company) {
      setErrorMsg('Please complete all required fields');
      return;
    }
    setErrorMsg('');
    setMode('2fa_setup');
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered.length < 6) {
      setErrorMsg('Please enter all 6 digits of your 2FA security code');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('2FA Verification Successful! Account Authenticated.');
    setTimeout(() => {
      onClose();
      setSuccessMsg('');
      setOtpCode(['', '', '', '', '', '']);
      setMode('login');
    }, 1200);
  };

  const handleCompleteSetup2FA = () => {
    const updatedUser: UserProfile = {
      ...currentUser,
      name,
      email,
      companyName: company,
      is2FAEnabled: true,
      twoFactorMethod,
    };
    onUpdateUser(updatedUser);
    setSuccessMsg('2FA Security Activated & Account Created!');
    setTimeout(() => {
      onClose();
      setSuccessMsg('');
      setMode('login');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-200">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {mode === 'login' && 'User Login & 2FA'}
              {mode === 'register' && 'Create Business Account'}
              {mode === '2fa_verify' && 'Two-Factor Authentication'}
              {mode === '2fa_setup' && 'Secure 2FA Configuration'}
            </h2>
            <p className="text-xs text-slate-500">
              {mode === '2fa_verify' 
                ? 'Protected by enterprise two-step security' 
                : 'Safe accounting portal for your business'}
            </p>
          </div>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* MODE 1: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                  placeholder="e.g. sarah@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Two-Factor Authentication (2FA) is automatically enforced for all financial logs.</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
            >
              <span>Continue with 2FA</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Don't have an account? Register new business
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                placeholder="Uttarwar Ganesh"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company / Business Name
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                  placeholder="Uttarwar Ganesh Business Solutions"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                placeholder="sarah@jenkinsconsulting.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
            >
              <span>Next: Setup 2FA Security</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Already registered? Back to Login
              </button>
            </div>
          </form>
        )}

        {/* MODE 3: 2FA VERIFY */}
        {mode === '2fa_verify' && (
          <form onSubmit={handleVerify2FA} className="space-y-5">
            <div className="p-4 bg-blue-50 rounded-xl text-center border border-blue-200">
              <Smartphone className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <p className="text-xs font-semibold text-blue-900">
                Enter 6-Digit 2FA Code
              </p>
              <p className="text-xs text-blue-700 mt-0.5">
                Sent via {twoFactorMethod === 'authenticator' ? 'Authenticator App (Google/Authy)' : 'SMS Verification'} to {currentUser.phoneNumber || 'registered device'}
              </p>
            </div>

            {/* OTP Code Input Boxes */}
            <div className="flex justify-between space-x-2 max-w-xs mx-auto">
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-10 h-12 text-center text-lg font-bold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                />
              ))}
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setOtpCode(['1', '2', '3', '4', '5', '6'])}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Auto-fill demo code (123456)
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Access Account</span>
            </button>
          </form>
        )}

        {/* MODE 4: 2FA SETUP */}
        {mode === '2fa_setup' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Select your preferred Two-Factor Authentication method to safeguard tax reports and financial documents:
            </p>

            <div className="space-y-2">
              <label 
                onClick={() => setTwoFactorMethod('authenticator')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  twoFactorMethod === 'authenticator'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-900'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <QrCode className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-xs font-semibold">Authenticator App (Recommended)</div>
                    <div className="text-[11px] text-slate-500">Google Authenticator, Microsoft, or Authy</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="2faMethod"
                  checked={twoFactorMethod === 'authenticator'}
                  onChange={() => setTwoFactorMethod('authenticator')}
                />
              </label>

              <label 
                onClick={() => setTwoFactorMethod('sms')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  twoFactorMethod === 'sms'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-900'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-xs font-semibold">SMS Security Code</div>
                    <div className="text-[11px] text-slate-500">Instant text messages to your mobile phone</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="2faMethod"
                  checked={twoFactorMethod === 'sms'}
                  onChange={() => setTwoFactorMethod('sms')}
                />
              </label>
            </div>

            {/* Authenticator QR Simulation */}
            {twoFactorMethod === 'authenticator' && (
              <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-200">
                <div className="w-24 h-24 mx-auto bg-white p-2 rounded-lg border shadow-inner flex items-center justify-center mb-2">
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-mono p-1 text-center">
                    [QR CODE SIMULATION]
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Secret key: <span className="font-mono text-slate-800 font-bold">BIZ-2FA-9902-SECR</span>
                </p>
              </div>
            )}

            <button
              onClick={handleCompleteSetup2FA}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Enable 2FA & Complete Setup</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
