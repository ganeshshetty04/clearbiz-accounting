import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Building, 
  User, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Database, 
  Sparkles, 
  KeyRound,
  FileCheck,
  QrCode,
  Info,
  Shield
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginPageProps {
  registeredUsers: UserProfile[];
  onLoginSuccess: (user: UserProfile) => void;
  onRegisterUser: (newUser: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  registeredUsers,
  onLoginSuccess,
  onRegisterUser,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register' | 'database'>('signin');
  
  // Sign In state
  const [selectedEmail, setSelectedEmail] = useState(registeredUsers[0]?.email || 'uttarwar.ganesh@example.com');
  const [password, setPassword] = useState('••••••••');
  const [step2FA, setStep2FA] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['1', '2', '3', '4', '5', '6']);

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regTaxId, setRegTaxId] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regTwoFactor, setRegTwoFactor] = useState<'authenticator' | 'sms' | 'email'>('authenticator');

  // Status feedback
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Handle Quick Login with a recorded user
  const handleQuickLogin = (user: UserProfile) => {
    setStatusMessage({
      type: 'success',
      text: `Welcome back, ${user.name}! Accessing ${user.companyName} financial vault...`,
    });
    setTimeout(() => {
      onLoginSuccess(user);
    }, 800);
  };

  // Handle Sign In Submit
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = registeredUsers.find((u) => u.email.toLowerCase() === selectedEmail.toLowerCase());
    
    if (!user) {
      setStatusMessage({ type: 'error', text: 'User email not found in recorded database. Please register a new account.' });
      return;
    }

    if (user.is2FAEnabled && !step2FA) {
      setStep2FA(true);
      setStatusMessage({ type: 'success', text: '2FA required! Enter the 6-digit verification code.' });
      return;
    }

    // Successfully verified
    setStatusMessage({ type: 'success', text: `Authentication successful! Welcome back ${user.name}.` });
    setTimeout(() => {
      onLoginSuccess(user);
    }, 1000);
  };

  // Handle New User Registration Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regCompany.trim()) {
      setStatusMessage({ type: 'error', text: 'Please complete all required fields (Name, Email, Company).' });
      return;
    }

    // Check if email exists
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === regEmail.toLowerCase());
    if (existing) {
      setStatusMessage({ type: 'error', text: 'An account with this email is already recorded. Please sign in.' });
      return;
    }

    const newUser: UserProfile = {
      id: 'usr_' + Date.now().toString().slice(-6),
      name: regName.trim(),
      email: regEmail.trim(),
      companyName: regCompany.trim(),
      taxId: regTaxId.trim() || 'XX-XXX' + Math.floor(1000 + Math.random() * 9000),
      is2FAEnabled: true,
      twoFactorMethod: regTwoFactor,
      phoneNumber: regPhone.trim() || '+1 (555) 000-1234',
      biometricsEnabled: true,
      passcodeHash: '1234',
      autoLockMinutes: 1,
      createdAt: new Date().toISOString(),
    };

    onRegisterUser(newUser);

    setStatusMessage({
      type: 'success',
      text: `User details recorded in encrypted storage! Logged in as ${newUser.name}.`,
    });

    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      
      {/* Top Bar Logo */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              ClearBiz <span className="text-blue-600 font-semibold">Accounting</span>
            </h1>
            <p className="text-xs text-slate-500">IRS Tax & Expense Accounting System</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full font-medium">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>Encrypted Business Data Portal</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl w-full mx-auto my-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Pitch & Information */}
        <div className="md:col-span-5 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Business Accounting Suite</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
            Streamlined Expense Management for Small Businesses
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Record, categorize, and organize your business expenses with automated receipt scanning, multi-user accounts, and IRS Schedule C tax readiness.
          </p>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-200 mt-0.5 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs font-bold text-slate-800 block">Complete User Profile Management</strong>
                <span className="text-xs text-slate-500">Stores full company details, Tax ID (EIN), contact details, and session settings.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 mt-0.5 shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs font-bold text-slate-800 block">Enhanced Account Security</strong>
                <span className="text-xs text-slate-500">Protects financial statements with two-factor authentication and biometric PIN locks.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-slate-100 text-slate-700 rounded-lg border border-slate-200 mt-0.5 shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs font-bold text-slate-800 block">Multi-Account Directory</strong>
                <span className="text-xs text-slate-500">Easily register, switch, or manage multiple team or client business accounts.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form & User Database */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                setActiveTab('signin');
                setStatusMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'signin'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => {
                setActiveTab('register');
                setStatusMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'register'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register Account
            </button>

            <button
              onClick={() => {
                setActiveTab('database');
                setStatusMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1 ${
                activeTab === 'database'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Accounts ({registeredUsers.length})</span>
            </button>
          </div>

          {/* Alert Message */}
          {statusMessage && (
            <div className={`p-3.5 rounded-xl border text-xs flex items-start space-x-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Business Account
                </label>
                <select
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                >
                  {registeredUsers.map((u) => (
                    <option key={u.id} value={u.email}>
                      {u.name} — {u.companyName} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              {step2FA && (
                <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-3">
                  <div className="flex items-center space-x-2 text-blue-900 text-xs font-bold">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>Enter 6-Digit Verification Code</span>
                  </div>
                  <div className="flex justify-between space-x-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value;
                          const updated = [...otpDigits];
                          updated[idx] = val;
                          setOtpDigits(updated);
                        }}
                        className="w-10 h-10 text-center font-bold text-lg bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 text-center">Demo 2FA Code auto-filled (123456)</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
              >
                <span>{step2FA ? 'Verify 2FA & Open Dashboard' : 'Sign In to Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER NEW USER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                Registering an account creates a dedicated local business profile in your portal.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Elena Vance"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={regCompany}
                      onChange={(e) => setRegCompany(e.target.value)}
                      placeholder="e.g. Vance Creative Studio"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Business Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="elena@vancecreative.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Federal Tax ID (EIN)</label>
                  <input
                    type="text"
                    value={regTaxId}
                    onChange={(e) => setRegTaxId(e.target.value)}
                    placeholder="XX-XXX9012"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+1 (555) 392-1092"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Set Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">2FA Verification Preference</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setRegTwoFactor('authenticator')}
                    className={`py-2 px-2 rounded-xl border font-semibold flex items-center justify-center space-x-1 ${
                      regTwoFactor === 'authenticator'
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Authenticator</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegTwoFactor('sms')}
                    className={`py-2 px-2 rounded-xl border font-semibold flex items-center justify-center space-x-1 ${
                      regTwoFactor === 'sms'
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>SMS Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegTwoFactor('email')}
                    className={`py-2 px-2 rounded-xl border font-semibold flex items-center justify-center space-x-1 ${
                      regTwoFactor === 'email'
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email OTP</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
              >
                <FileCheck className="w-4 h-4" />
                <span>Register Account & Sign In</span>
              </button>
            </form>
          )}

          {/* TAB 3: RECORDED USER DATABASE */}
          {activeTab === 'database' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Registered Accounts ({registeredUsers.length})
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Saved Profiles
                </span>
              </div>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {registeredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">{u.name}</span>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.2 rounded font-mono">
                          {u.id}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium">
                        {u.companyName} • Tax ID: {u.taxId || 'Registered'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {u.email} • 2FA: {u.is2FAEnabled ? u.twoFactorMethod?.toUpperCase() : 'DISABLED'}
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickLogin(u)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                    >
                      Login As
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-slate-500 text-center pt-2">
                All business account credentials are fully managed within your local workspace session.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Footer */}
      <div className="max-w-6xl w-full mx-auto text-center pt-6 border-t border-slate-200 text-xs text-slate-500">
        ClearBiz Expense Accounting — Professional Schedule C Financial Portal
      </div>

    </div>
  );
};
