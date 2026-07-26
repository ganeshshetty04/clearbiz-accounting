export type CategoryType = 
  | 'Office Supplies & Equipment'
  | 'Meals & Client Entertainment'
  | 'Travel & Mileage'
  | 'Software & Subscriptions'
  | 'Marketing & Advertising'
  | 'Professional Services & Legal'
  | 'Utilities & Internet'
  | 'Rent & Facilities'
  | 'Maintenance & Repairs'
  | 'Other Expenses';

export interface ExpenseItem {
  id: string;
  merchant: string;
  amount: number;
  currency: string;
  category: CategoryType;
  date: string; // YYYY-MM-DD
  paymentMethod: 'Credit Card' | 'Debit Card' | 'Cash' | 'Bank Transfer';
  taxDeductible: boolean;
  taxAmount?: number;
  notes?: string;
  receiptUrl?: string; // base64 or URL preview
  receiptFileName?: string;
  isSynced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  companyName: string;
  taxId?: string;
  is2FAEnabled: boolean;
  twoFactorMethod?: 'authenticator' | 'sms' | 'email';
  phoneNumber?: string;
  biometricsEnabled: boolean;
  passcodeHash?: string;
  autoLockMinutes: number; // 0 = immediate, 1, 5, 15
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  requires2FA: boolean;
  pendingUser?: Partial<UserProfile> | null;
  twoFactorStep?: 'choose_method' | 'enter_code';
  tempMethod?: 'authenticator' | 'sms' | 'email';
}

export interface ScanReceiptResponse {
  merchant: string;
  amount: number;
  currency: string;
  category: CategoryType;
  date: string;
  taxAmount?: number;
  paymentMethod?: 'Credit Card' | 'Debit Card' | 'Cash' | 'Bank Transfer';
  taxDeductible: boolean;
  notes?: string;
  lineItems?: Array<{ name: string; price: number }>;
  confidenceScore: number;
  rawText?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedExpense?: Partial<ExpenseItem>;
  taxTip?: string;
}

export interface CloudBackup {
  id: string;
  timestamp: string;
  expensesCount: number;
  totalAmount: number;
  deviceInfo: string;
  sizeKb: number;
}

export interface SyncStatus {
  isOnline: boolean;
  pendingCount: number;
  lastSyncedAt: string | null;
  syncing: boolean;
}
