import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../store/slices/authSlice';
import { IconLayers, IconUsers, IconMail, IconLock, IconCheck, IconShield } from '../utils/helpers';

const FONT_DISPLAY = "font-['Space_Grotesk']";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] font-sans text-[#E8EAED] lg:grid lg:grid-cols-2">
      {/* Left — brand panel, hidden below lg */}
      <div className="relative hidden overflow-hidden border-r border-[#232A38] bg-gradient-to-br from-[#131720] to-[#0F131B] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(#8B93A1 1px, transparent 1px), linear-gradient(90deg, #8B93A1 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div
          className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: '#FF6B1A' }}
        />

        <Link to="/" className="relative flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-[#2A3244] bg-[#0B0E14] text-[#34D1BF]">
            <IconLayers className="h-4 w-4" />
          </span>
          <span className={`${FONT_DISPLAY} text-lg font-semibold tracking-tight text-[#E8EAED]`}>StockXpress</span>
        </Link>

        <div className="relative max-w-sm">
          <h2 className={`${FONT_DISPLAY} text-3xl font-semibold leading-[1.15] tracking-tight text-[#E8EAED]`}>
            Set up your workspace in <span className="text-[#FF6B1A]">under a minute</span>.
          </h2>
          <ul className="mt-8 space-y-3.5">
            {[
              'Start browsing and ordering right away',
              'Bring your warehouse team in when ready',
              'Every action tracked, from day one',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-[#8B93A1]">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#34D1BF]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-[#8B93A1]">© {new Date().getFullYear()} StockXpress</p>
      </div>

      {/* Right — form */}
      <div className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          {/* Mobile-only logo */}
          <Link to="/" className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-[#2A3244] bg-[#131720] text-[#34D1BF]">
              <IconLayers className="h-4 w-4" />
            </span>
            <span className={`${FONT_DISPLAY} text-lg font-semibold tracking-tight text-[#E8EAED]`}>StockXpress</span>
          </Link>

          <h1 className={`${FONT_DISPLAY} text-center text-2xl font-semibold tracking-tight text-[#E8EAED] sm:text-left sm:text-3xl`}>
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm text-[#8B93A1] sm:text-left">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[#FF6B1A] hover:text-[#FF7A30]">
              Sign in
            </Link>
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-[#8B93A1]">
                Full name
              </label>
              <div className="relative">
                <IconUsers className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B93A1]" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#232A38] bg-[#131720] py-2.5 pl-10 pr-3.5 text-sm text-[#E8EAED] placeholder-[#5A6270] outline-none transition-colors focus:border-[#34D1BF]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-[#8B93A1]">
                Email address
              </label>
              <div className="relative">
                <IconMail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B93A1]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#232A38] bg-[#131720] py-2.5 pl-10 pr-3.5 text-sm text-[#E8EAED] placeholder-[#5A6270] outline-none transition-colors focus:border-[#34D1BF]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-[#8B93A1]">
                Password
              </label>
              <div className="relative">
                <IconLock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B93A1]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#232A38] bg-[#131720] py-2.5 pl-10 pr-3.5 text-sm text-[#E8EAED] placeholder-[#5A6270] outline-none transition-colors focus:border-[#34D1BF]"
                />
              </div>

              {/* Show/hide password — tick checkbox */}
              <label htmlFor="show-password" className="mt-2.5 flex w-fit cursor-pointer select-none items-center gap-2">
                <input
                  id="show-password"
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="sr-only"
                />
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors"
                  style={
                    showPassword
                      ? { backgroundColor: '#34D1BF', borderColor: '#34D1BF' }
                      : { backgroundColor: 'transparent', borderColor: '#3A4254' }
                  }
                >
                  {showPassword && <IconCheck className="h-3 w-3 text-[#0B0E14]" strokeWidth={3} />}
                </span>
                <span className="text-xs text-[#8B93A1]">Show password</span>
              </label>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-[#FB7185]/30 bg-[#FB7185]/10 px-3.5 py-2.5 text-xs text-[#FB7185]">
                <IconShield className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{typeof error === 'string' ? error : JSON.stringify(error)}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#FF6B1A] py-2.5 text-sm font-medium text-[#0B0E14] transition-transform hover:-translate-y-0.5 hover:bg-[#FF7A30] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;