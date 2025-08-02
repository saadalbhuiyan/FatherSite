import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp, verifyOtp } from '../api';

export default function AdminLogin() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('adminToken')) nav('/admin-dash');
  }, [nav]);

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSend = async () => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendOtp(email);
      setMessage('OTP sent to your email.');
      setStep(2);
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await verifyOtp(email, otp);
      localStorage.setItem('adminToken', data.token);
      nav('/admin-dash');
    } catch {
      setError('Incorrect OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-slate-800">Admin Login</h2>

        {message && <p className="text-center text-green-600">{message}</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {step === 1 && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full rounded-md border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={handleSend}
              disabled={loading || !isValidEmail(email)}
              className="w-full rounded-md bg-sky-600 py-2 text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Sending…' : 'Send OTP'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              required
              className="w-full rounded-md border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={handleVerify}
              disabled={loading || !otp.trim()}
              className="w-full rounded-md bg-sky-600 py-2 text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Verifying…' : 'Verify'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
