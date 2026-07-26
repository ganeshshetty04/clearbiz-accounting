import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Cloud, 
  RefreshCw, 
  Fingerprint, 
  KeyRound, 
  Smartphone, 
  Database, 
  Wifi, 
  WifiOff, 
  Download, 
  CheckCircle2, 
  UserCheck, 
  Building, 
  Sparkles,
  Info,
  LogOut,
  User
} from 'lucide-react';
import { UserProfile, CloudBackup, SyncStatus, ExpenseItem } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  backups: CloudBackup[];
  onCreateBackup: () => void;
  syncStatus: SyncStatus;
  onForceSync: () => void;
  isSimulatedOffline: boolean;
  onToggleOffline: () => void;
  onLockAppNow: () => void;
  onSignOut?: () => void;
  expenses: ExpenseItem[];
  easyMode: boolean;
  onToggleEasyMode: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  backups,
  onCreateBackup,
  syncStatus,
  onForceSync,
  isSimulatedOffline,
  onToggleOffline,
  onLockAppNow,
  onSignOut,
  expenses,
  easyMode,
  onToggleEasyMode,
}) => {
  const [name, setName] = useState(user.name);
  const [company, setCompany] = useState(user.companyName);
  const [taxId, setTaxId] = useState(user.taxId || '');
  const [biometricsEnabled, setBiometricsEnabled] = useState(user.biometricsEnabled);
  const [passcode, setPasscode] = useState(user.passcodeHash || '1234');
  const [autoLockMinutes, setAutoLockMinutes] = useState(user.autoLockMinutes || 1);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name,
      companyName: company,
      taxId,
      biometricsEnabled,
      passcodeHash: passcode,
      autoLockMinutes,
    };
    onUpdateUser(updated);
    setSaveMessage('Profile & Security Settings Saved!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-4xl mx-auto">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Vault, Cloud Backup & Security</h2>
        <p className="text-xs text-slate-500">
          Manage biometric lock, cloud backup snapshots, 2FA authentication, and offline auto-synchronization.
        </p>
      </div>

      {saveMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* 1. Integrated Cloud Backup & Sync Vault */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cloud Backup & Sync Vault</h3>
              <p className="text-xs text-slate-500">256-Bit Encrypted Automatic Cloud Storage</p>
            </div>
          </div>

          <button
            onClick={onCreateBackup}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <Database className="w-4 h-4" />
            <span>Backup Now</span>
          </button>
        </div>

        {/* Sync Queue Banner */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            {isSimulatedOffline ? (
              <WifiOff className="w-5 h-5 text-amber-500 shrink-0" />
            ) : (
              <Wifi className="w-5 h-5 text-emerald-500 shrink-0" />
            )}
            <div>
              <div className="text-xs font-bold text-slate-900">
                Network Mode: {isSimulatedOffline ? 'Simulated Offline Mode' : 'Online Cloud Connection'}
              </div>
              <div className="text-[11px] text-slate-500">
                {syncStatus.pendingCount === 0
                  ? 'All local receipts & transactions synced with cloud vault.'
                  : `${syncStatus.pendingCount} offline transaction(s) queued for sync.`}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleOffline}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                isSimulatedOffline
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {isSimulatedOffline ? 'Go Online' : 'Simulate Offline'}
            </button>

            <button
              onClick={onForceSync}
              disabled={syncStatus.syncing}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center space-x-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus.syncing ? 'animate-spin' : ''}`} />
              <span>Sync Queue</span>
            </button>
          </div>
        </div>

        {/* Timestamped Backups List */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Cloud Backup History
          </h4>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {backups.map((b) => (
              <div key={b.id} className="p-3 bg-white flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">
                    {new Date(b.timestamp).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {b.expensesCount} expenses • ${b.totalAmount.toFixed(2)} total ({b.sizeKb} KB)
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold">
                  Encrypted Vault
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Biometric & Vault Security Config */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Biometric Security & App Lock</h3>
            <p className="text-xs text-slate-500">Touch ID, Face ID, and PIN Passcode protection for financial records</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Fingerprint className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">Enable Touch ID / Face ID Lock</div>
                <div className="text-[11px] text-slate-500">Requires biometric verification to open app or view reports</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={biometricsEnabled}
              onChange={(e) => setBiometricsEnabled(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Security PIN Passcode
              </label>
              <input
                type="text"
                maxLength={4}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 tracking-widest text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Auto-Lock Timer
              </label>
              <select
                value={autoLockMinutes}
                onChange={(e) => setAutoLockMinutes(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
              >
                <option value={0}>Lock Immediately on Tab Blur</option>
                <option value={1}>1 Minute Idle</option>
                <option value={5}>5 Minutes Idle</option>
                <option value={15}>15 Minutes Idle</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={onLockAppNow}
              className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-xs flex items-center space-x-1.5"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Lock Vault Now</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Save Security Preferences
            </button>
          </div>
        </form>
      </div>

      {/* 3. Business Profile & Accessibility Settings */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Business Profile & UI Preferences</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Business / Company Name
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Federal Tax ID (EIN / SSN)
            </label>
            <input
              type="text"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              placeholder="XX-XXXXXXX"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
            />
          </div>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <div className="text-xs font-bold text-slate-900">Friendly "Easy Mode" Interface</div>
              <div className="text-[11px] text-slate-500">Larger touch targets, high contrast text, and simple explanations</div>
            </div>
          </div>
          <button
            onClick={onToggleEasyMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              easyMode ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {easyMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* 4. Active Account Session & User Record */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Business User Record</h3>
              <p className="text-xs text-slate-500">Currently authenticated profile & session persistence</p>
            </div>
          </div>

          {onSignOut && (
            <button
              onClick={onSignOut}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out / Switch Account</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block font-semibold">User Name & ID</span>
            <span className="text-slate-900 font-bold">{user.name}</span>
            <span className="text-blue-600 ml-2 text-[10px] bg-blue-50 px-1.5 py-0.5 rounded font-mono">{user.id}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block font-semibold">Registered Email</span>
            <span className="text-slate-900 font-bold">{user.email}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block font-semibold">Business Entity</span>
            <span className="text-slate-900 font-bold">{user.companyName}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block font-semibold">Federal Tax ID (EIN)</span>
            <span className="text-slate-900 font-bold">{user.taxId || 'Not set'}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
