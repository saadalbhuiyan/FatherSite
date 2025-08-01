import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp, verifyOtp } from '../api';

export default function AdminLogin() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSend = async () => {
    setLoading(true);
    try { await sendOtp(email); setStep(2); } catch { alert('Send failed'); }
    finally { setLoading(false); }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const { data } = await verifyOtp(email, otp);
      localStorage.setItem('adminToken', data.token);
      nav('/admin-dash');
    } catch { alert('Wrong OTP'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 360, margin: 'auto' }}>
      <h2>Admin Login</h2>
      {step === 1 && (
        <>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
          <button onClick={handleSend} disabled={loading}>{loading ? 'Sending…' : 'Send OTP'}</button>
        </>
      )}
      {step === 2 && (
        <>
          <input value={otp} onChange={e => setOtp(e.target.value)} placeholder="OTP" required />
          <button onClick={handleVerify} disabled={loading}>{loading ? 'Verifying…' : 'Verify'}</button>
        </>
      )}
    </div>
  );
}