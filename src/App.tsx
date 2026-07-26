import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { ExpensesView } from './components/ExpensesView';
import { ReceiptScannerView } from './components/ReceiptScannerView';
import { AIAssistantView } from './components/AIAssistantView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { BiometricLockScreen } from './components/BiometricLockScreen';
import { ExpenseItem, UserProfile, CloudBackup, SyncStatus } from './types';
import { 
  getStoredExpenses, 
  saveStoredExpenses, 
  getStoredUser, 
  saveStoredUser, 
  getStoredRegisteredUsers,
  registerAndSaveUser,
  getStoredAuthSession,
  saveStoredAuthSession,
  getStoredBackups, 
  createCloudBackupSnapshot,
  getBiometricLockStatus,
  setBiometricLockStatus,
  addUnsyncedExpense,
  clearSyncQueue
} from './lib/storage';

export default function App() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => getStoredExpenses());
  const [user, setUser] = useState<UserProfile>(() => getStoredUser());
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => getStoredRegisteredUsers());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getStoredAuthSession().isAuthenticated);
  
  const [backups, setBackups] = useState<CloudBackup[]>(() => getStoredBackups());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBiometricLocked, setIsBiometricLocked] = useState<boolean>(() => getBiometricLockStatus());
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [easyMode, setEasyMode] = useState(false);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);

  // Sync status
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    pendingCount: 0,
    lastSyncedAt: new Date().toISOString(),
    syncing: false,
  });

  // Keep state synchronized with LocalStorage
  useEffect(() => {
    saveStoredExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    saveStoredUser(user);
    setRegisteredUsers(getStoredRegisteredUsers());
  }, [user]);

  // Handle Login Success
  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    saveStoredAuthSession({ isAuthenticated: true, currentUserId: loggedInUser.id });
  };

  // Handle Register User
  const handleRegisterUser = (newUser: UserProfile) => {
    const updatedList = registerAndSaveUser(newUser);
    setRegisteredUsers(updatedList);
  };

  // Handle Sign Out
  const handleSignOut = () => {
    setIsAuthenticated(false);
    saveStoredAuthSession({ isAuthenticated: false, currentUserId: user.id });
  };

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus((prev) => ({ ...prev, isOnline: true }));
      triggerBackgroundSync();
    };
    const handleOffline = () => {
      setSyncStatus((prev) => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Background cloud synchronization
  const triggerBackgroundSync = async () => {
    setSyncStatus((prev) => ({ ...prev, syncing: true }));
    try {
      await fetch('/api/backup/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expenses, user }),
      });
      clearSyncQueue();
      // Mark all expenses as synced
      setExpenses((prev) => prev.map((e) => ({ ...e, isSynced: true })));
      setSyncStatus({
        isOnline: !isSimulatedOffline,
        pendingCount: 0,
        lastSyncedAt: new Date().toISOString(),
        syncing: false,
      });
    } catch (e) {
      console.error('Sync failed', e);
      setSyncStatus((prev) => ({ ...prev, syncing: false }));
    }
  };

  // Add Expense
  const handleAddExpense = (
    newExpenseData: Omit<ExpenseItem, 'id' | 'createdAt' | 'updatedAt' | 'isSynced'>
  ) => {
    const now = new Date().toISOString();
    const newExpense: ExpenseItem = {
      ...newExpenseData,
      id: 'exp_' + Date.now(),
      isSynced: !isSimulatedOffline,
      createdAt: now,
      updatedAt: now,
    };

    setExpenses((prev) => [newExpense, ...prev]);

    if (isSimulatedOffline) {
      addUnsyncedExpense(newExpense.id);
      setSyncStatus((prev) => ({ ...prev, pendingCount: prev.pendingCount + 1 }));
    } else {
      triggerBackgroundSync();
    }
  };

  // Update Expense
  const handleUpdateExpense = (updated: ExpenseItem) => {
    setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    triggerBackgroundSync();
  };

  // Delete Expense
  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    triggerBackgroundSync();
  };

  // Create Cloud Backup
  const handleCreateBackup = () => {
    const backup = createCloudBackupSnapshot(expenses);
    setBackups((prev) => [backup, ...prev]);
    triggerBackgroundSync();
  };

  // Lock / Unlock Vault
  const handleLockVault = () => {
    setIsBiometricLocked(true);
    setBiometricLockStatus(true);
  };

  const handleUnlockVault = () => {
    setIsBiometricLocked(false);
    setBiometricLockStatus(false);
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        registeredUsers={registeredUsers}
        onLoginSuccess={handleLoginSuccess}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Header */}
      <Header
        user={user}
        syncStatus={syncStatus}
        onForceSync={triggerBackgroundSync}
        onLockApp={handleLockVault}
        onOpenSettings={() => setActiveTab('settings')}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
        easyMode={easyMode}
        onToggleEasyMode={() => setEasyMode(!easyMode)}
      />

      {/* Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        easyMode={easyMode}
      />

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            expenses={expenses}
            user={user}
            syncStatus={syncStatus}
            onNavigate={setActiveTab}
            onOpenAddModal={() => setIsAddExpenseModalOpen(true)}
            easyMode={easyMode}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesView
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
            isAddModalOpen={isAddExpenseModalOpen}
            setIsAddModalOpen={setIsAddExpenseModalOpen}
            easyMode={easyMode}
          />
        )}

        {activeTab === 'scan' && (
          <ReceiptScannerView
            onConfirmReceiptExpense={(scanned) => {
              handleAddExpense(scanned);
              setActiveTab('expenses');
            }}
            easyMode={easyMode}
          />
        )}

        {activeTab === 'assistant' && (
          <AIAssistantView
            onAddSuggestedExpense={(suggested) => {
              handleAddExpense(suggested);
              setActiveTab('expenses');
            }}
            easyMode={easyMode}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            expenses={expenses}
            user={user}
            easyMode={easyMode}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            user={user}
            onUpdateUser={setUser}
            backups={backups}
            onCreateBackup={handleCreateBackup}
            syncStatus={syncStatus}
            onForceSync={triggerBackgroundSync}
            isSimulatedOffline={isSimulatedOffline}
            onToggleOffline={() => {
              const next = !isSimulatedOffline;
              setIsSimulatedOffline(next);
              setSyncStatus((prev) => ({ ...prev, isOnline: !next }));
            }}
            onLockAppNow={handleLockVault}
            onSignOut={handleSignOut}
            expenses={expenses}
            easyMode={easyMode}
            onToggleEasyMode={() => setEasyMode(!easyMode)}
          />
        )}
      </main>

      {/* Auth & 2FA Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
        onUpdateUser={setUser}
      />

      {/* Biometric Lock Screen Overlay */}
      <BiometricLockScreen
        isLocked={isBiometricLocked}
        user={user}
        onUnlock={handleUnlockVault}
      />

    </div>
  );
}
