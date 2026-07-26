import React, { useState } from 'react';
import { 
  Lock, 
  Fingerprint, 
  Scan, 
  Key, 
  ShieldCheck, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { UserProfile } from '../types';

interface BiometricLockScreenProps {
  isLocked: boolean;
  user: UserProfile;
  onUnlock: () => void;
}

export const BiometricLockScreen: React.FC<BiometricLockScreenProps> = ({
  isLocked,
  user,
  onUnlock,
}) => {
  const [method, setMethod] = useState<'biometric' | 'pin'>('biometric');
  const [pin, setPin] = useState(['', '', '', '']);
  const [scanning, setScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLocked) return null;

  const handleSimulateBiometricScan = () => {
    setScanning(true);
    setErrorMsg('');
    setTimeout(() => {
      setScanning(false);
      onUnlock();
    }, 1200);
  };

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) value = value.charAt(value.length - 1);
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      document.getElementById(`pin-input-${index + 1}`)?.focus();
    }

    // Auto unlock if 1234 or hash match
    const joined = newPin.join('');
    if (joined.length === 4) {
      if (joined === '1234' || joined === user.passcodeHash) {
        onUnlock();
      } else {
        setErrorMsg('Incorrect PIN. Please try again (Demo PIN: 1234)');
        setTimeout(() => {
          setPin(['', '', '', '']);
          setErrorMsg('');
        }, 1500);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-8 text-center text-slate-900 shadow-xl relative overflow-hidden">
        
        {/* Shield Icon Header */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <Lock className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Session Security Lock
        </h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Biometric security active for {user.companyName || 'Business Expenses'}
        </p>

        {errorMsg && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center justify-center space-x-1.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* METHOD 1: BIOMETRIC FACE / TOUCH SCAN */}
        {method === 'biometric' && (
          <div className="space-y-6">
            <div 
              onClick={handleSimulateBiometricScan}
              className={`w-24 h-24 mx-auto rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all ${
                scanning 
                  ? 'border-blue-600 bg-blue-50 shadow-xs' 
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
              }`}
              title="Click to scan Touch ID or Face ID"
            >
              {scanning ? (
                <div className="flex flex-col items-center space-y-1.5">
                  <Scan className="w-10 h-10 text-blue-600 animate-pulse" />
                  <span className="text-[10px] text-blue-700 font-semibold">Verifying...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-1.5">
                  <Fingerprint className="w-10 h-10 text-blue-600" />
                  <span className="text-[10px] text-slate-500 font-medium">Tap to Scan</span>
                </div>
              )}
            </div>

            <button
              onClick={handleSimulateBiometricScan}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Unlock with Touch ID / Face ID</span>
            </button>

            <button
              onClick={() => setMethod('pin')}
              className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
            >
              Use 4-digit PIN Passcode instead
            </button>
          </div>
        )}

        {/* METHOD 2: PIN PASSCODE */}
        {method === 'pin' && (
          <div className="space-y-6">
            <p className="text-xs text-slate-500">Enter 4-digit security PIN (Demo: 1234)</p>
            
            <div className="flex justify-center space-x-3">
              {pin.map((digit, idx) => (
                <input
                  key={idx}
                  id={`pin-input-${idx}`}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(idx, e.target.value)}
                  className="w-12 h-13 text-center text-xl font-bold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900"
                />
              ))}
            </div>

            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  setPin(['1', '2', '3', '4']);
                  onUnlock();
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200"
              >
                Use Quick Demo PIN (1234)
              </button>

              <button
                onClick={() => setMethod('biometric')}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Back to Face ID / Touch ID
              </button>
            </div>
          </div>
        )}

        {/* Security badge footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-center space-x-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Session Vault Protection Active</span>
        </div>

      </div>
    </div>
  );
};
