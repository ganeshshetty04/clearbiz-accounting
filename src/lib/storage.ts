import { ExpenseItem, UserProfile, CloudBackup, SyncStatus } from '../types';
import { INITIAL_EXPENSES, INITIAL_USER, INITIAL_REGISTERED_USERS, INITIAL_BACKUPS } from './mockData';

const EXPENSES_KEY = 'biz_expenses_data_v1';
const USER_KEY = 'biz_user_profile_v1';
const REGISTERED_USERS_KEY = 'biz_registered_users_list_v1';
const AUTH_SESSION_KEY = 'biz_auth_session_v1';
const BACKUPS_KEY = 'biz_cloud_backups_v1';
const SYNC_QUEUE_KEY = 'biz_sync_queue_v1';
const BIOMETRIC_LOCKED_KEY = 'biz_biometric_locked_v1';

export function getStoredExpenses(): ExpenseItem[] {
  try {
    const raw = localStorage.getItem(EXPENSES_KEY);
    if (!raw) {
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(INITIAL_EXPENSES));
      return INITIAL_EXPENSES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load expenses', e);
    return INITIAL_EXPENSES;
  }
}

export function saveStoredExpenses(expenses: ExpenseItem[]): void {
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  } catch (e) {
    console.error('Failed to save expenses', e);
  }
}

export function getStoredUser(): UserProfile {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      localStorage.setItem(USER_KEY, JSON.stringify(INITIAL_USER));
      return INITIAL_USER;
    }
    const parsed = JSON.parse(raw);
    if (parsed.name === 'Sarah Jenkins' || parsed.id === 'usr_789023') {
      const updated = { ...parsed, name: 'Uttarwar Ganesh', email: 'uttarwar.ganesh@example.com', companyName: 'Uttarwar Ganesh Business Solutions' };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    }
    return parsed;
  } catch (e) {
    return INITIAL_USER;
  }
}

export function saveStoredUser(user: UserProfile): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // Also update in registered user list
    registerAndSaveUser(user);
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
}

export function getStoredRegisteredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(INITIAL_REGISTERED_USERS));
      return INITIAL_REGISTERED_USERS;
    }
    const list: UserProfile[] = JSON.parse(raw);
    const updatedList = list.map((u) => 
      u.name === 'Sarah Jenkins' || u.id === 'usr_789023' 
        ? { ...u, name: 'Uttarwar Ganesh', email: 'uttarwar.ganesh@example.com', companyName: 'Uttarwar Ganesh Business Solutions' }
        : u
    );
    return updatedList;
  } catch (e) {
    return INITIAL_REGISTERED_USERS;
  }
}

export function registerAndSaveUser(newUser: UserProfile): UserProfile[] {
  try {
    const users = getStoredRegisteredUsers();
    const index = users.findIndex((u) => u.id === newUser.id || u.email.toLowerCase() === newUser.email.toLowerCase());
    let updated: UserProfile[];
    if (index >= 0) {
      updated = [...users];
      updated[index] = newUser;
    } else {
      updated = [newUser, ...users];
    }
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save registered user', e);
    return getStoredRegisteredUsers();
  }
}

export function getStoredAuthSession(): { isAuthenticated: boolean; currentUserId: string | null } {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) {
      // Default initial session: authenticated as INITIAL_USER for smooth start, or false if specified
      const session = { isAuthenticated: false, currentUserId: INITIAL_USER.id };
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
      return session;
    }
    return JSON.parse(raw);
  } catch (e) {
    return { isAuthenticated: false, currentUserId: INITIAL_USER.id };
  }
}

export function saveStoredAuthSession(session: { isAuthenticated: boolean; currentUserId: string | null }): void {
  try {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save auth session', e);
  }
}

export function getStoredBackups(): CloudBackup[] {
  try {
    const raw = localStorage.getItem(BACKUPS_KEY);
    if (!raw) {
      localStorage.setItem(BACKUPS_KEY, JSON.stringify(INITIAL_BACKUPS));
      return INITIAL_BACKUPS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_BACKUPS;
  }
}

export function saveStoredBackups(backups: CloudBackup[]): void {
  try {
    localStorage.setItem(BACKUPS_KEY, JSON.stringify(backups));
  } catch (e) {
    console.error('Failed to save backups', e);
  }
}

export function getSyncQueue(): string[] {
  try {
    const raw = localStorage.getItem(SYNC_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function addUnsyncedExpense(expenseId: string): void {
  const queue = getSyncQueue();
  if (!queue.includes(expenseId)) {
    queue.push(expenseId);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  }
}

export function clearSyncQueue(): void {
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify([]));
}

export function getBiometricLockStatus(): boolean {
  try {
    return localStorage.getItem(BIOMETRIC_LOCKED_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function setBiometricLockStatus(locked: boolean): void {
  try {
    localStorage.setItem(BIOMETRIC_LOCKED_KEY, locked ? 'true' : 'false');
  } catch (e) {
    console.error(e);
  }
}

export function createCloudBackupSnapshot(expenses: ExpenseItem[]): CloudBackup {
  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const now = new Date().toISOString();
  const backup: CloudBackup = {
    id: 'bkp_' + Date.now(),
    timestamp: now,
    expensesCount: expenses.length,
    totalAmount: Math.round(total * 100) / 100,
    deviceInfo: 'Auto Cloud Sync (Encrypted Vault)',
    sizeKb: Math.round((JSON.stringify(expenses).length / 1024) * 10) / 10,
  };

  const backups = getStoredBackups();
  const updatedBackups = [backup, ...backups];
  saveStoredBackups(updatedBackups);
  return backup;
}
