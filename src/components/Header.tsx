import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Cloud, 
  User, 
  KeyRound,
  CheckCircle2,
  Sparkles,
  LogOut
} from 'lucide-react';
import { UserProfile, SyncStatus } from '../types';

interface HeaderProps {
  user: UserProfile;
  syncStatus: SyncStatus;
  onForceSync: () => void;
  onLockApp: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
  easyMode: boolean;
  onToggleEasyMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  syncStatus,
  onForceSync,
  onLockApp,
  onOpenSettings,
  onOpenAuth,
  onSignOut,
  easyMode,
  onToggleEasyMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white text-slate-900 border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & App Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-xs">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                ClearBiz <span className="font-normal text-blue-600">Accounting</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                2FA Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden xs:block">
              {user.companyName || 'Business Expense Accounting'}
            </p>
          </div>
        </div>

        {/* Action Controls & Sync Indicators */}
        <div className="flex items-center space-x-2 sm:space-x-3">

          {/* Easy Mode Toggle Pill */}
          <button
            onClick={onToggleEasyMode}
            className={`px-2.5 py-1.5 text-xs rounded-lg font-medium transition-colors flex items-center space-x-1.5 ${
              easyMode 
                ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Toggle Friendly Easy Mode with larger buttons & text"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">{easyMode ? 'Easy Mode: ON' : 'Easy Mode'}</span>
          </button>

          {/* Sync Status Badge */}
          <button
            onClick={onForceSync}
            disabled={syncStatus.syncing}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 border transition-all ${
              !syncStatus.isOnline
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : syncStatus.pendingCount > 0
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
            title="Click to force cloud backup sync"
          >
            {syncStatus.syncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span className="hidden sm:inline">Syncing...</span>
              </>
            ) : !syncStatus.isOnline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span>Offline ({syncStatus.pendingCount})</span>
              </>
            ) : syncStatus.pendingCount > 0 ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-blue-600" />
                <span>Sync ({syncStatus.pendingCount})</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Synced</span>
              </>
            )}
          </button>

          {/* Biometric Lock Button */}
          <button
            onClick={onLockApp}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center space-x-1.5"
            title="Lock Financial Vault (Biometric Security)"
            id="biometric-lock-button"
          >
            <Lock className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold hidden lg:inline">Lock Vault</span>
          </button>

          {/* Account Profile / Auth Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg border border-blue-200 transition-colors"
            title="Manage User Account & 2FA"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
              {user.name ? user.name.charAt(0) : 'S'}
            </div>
            <span className="text-xs font-semibold hidden md:inline truncate max-w-[120px]">
              {user.name.split(' ')[0]}
            </span>
            <KeyRound className="w-3.5 h-3.5 text-blue-600 hidden sm:inline" />
          </button>

          {/* Sign Out Button */}
          <button
            onClick={onSignOut}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors flex items-center space-x-1"
            title="Sign Out / Switch User Account"
            id="sign-out-button"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs font-semibold hidden xl:inline">Sign Out</span>
          </button>

        </div>

      </div>
    </header>
  );
};
