import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User as UserIcon, 
  Lock, 
  ShieldCheck, 
  Headset, 
  GraduationCap,
  Star,
  MapPin
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchApi } from '../lib/api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [branch, setBranch] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password, role, branch }),
      });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-surface-container-lowest overflow-hidden">
      {/* Left Side: Form */}
      <section className="flex w-full items-center justify-center p-8 md:w-[45%] md:p-16 lg:p-24 z-10 overflow-y-auto max-h-screen">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md my-auto pb-10"
        >
          {/* Logo & Header */}
          <div className="mb-10 text-center md:text-left">
             <div className="flex justify-center md:justify-start mb-6">
                <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20">
                    <GraduationCap className="h-10 w-10 text-white" />
                </div>
             </div>
            <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Create Account</h1>
            <p className="text-on-surface-variant font-medium">Join the EduReg System Academic Portal</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleRegister}>
            {error && (
              <div className="rounded-xl bg-error-container p-4 text-sm font-medium text-error">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl bg-green-100 p-4 text-sm font-medium text-green-700 border border-green-200">
                {success}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Username / Student ID</label>
              <div className="group relative">
                <UserIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your unique ID"
                  className="w-full rounded-2xl border border-outline-variant bg-surface-bright py-3.5 pl-12 pr-4 text-sm font-medium transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Password</label>
              <div className="group relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full rounded-2xl border border-outline-variant bg-surface-bright py-3.5 pl-12 pr-4 text-sm font-medium transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Role</label>
                <div className="group relative">
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'student' | 'admin')}
                    className="w-full rounded-2xl border border-outline-variant bg-surface-bright py-3.5 px-4 text-sm font-medium transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-outline">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-outline ml-1">Branch (Optional)</label>
                <div className="group relative">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. CS"
                    className="w-full rounded-2xl border border-outline-variant bg-surface-bright py-3.5 pl-12 pr-4 text-sm font-medium transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none shadow-sm"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !!success}
              className="mt-4 w-full rounded-2xl bg-primary py-4 text-sm font-black uppercase tracking-widest text-on-primary shadow-xl shadow-primary/20 transition-all hover:bg-primary-container active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Register'}
            </button>

            <p className="mt-6 text-center text-xs font-bold text-on-surface-variant">
              Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in instead</Link>
            </p>
          </form>

          {/* Footer Items */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 border-t border-outline-variant pt-8 md:justify-start">
            <div className="flex items-center gap-2 text-outline">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">Secure Portal</span>
            </div>
            <div className="flex items-center gap-2 text-outline">
              <Headset className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">Help Desk</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Right Side: Showcase */}
      <section className="relative hidden flex-1 overflow-hidden bg-primary-container md:flex">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/20 to-primary/60 mix-blend-multiply" />
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1BFWaSsQjv4tYuGMaDg-UYLGcvPDxK2B2h20-gNKdU8cMFBuXCBolqRE8zrPVtkmpZTWPW1JQbpaApDhUtz-HNN5Mx7SG7i-HL6RY0_tAvBqDj013Q0RVeFpGVlFvUqNz8K1SoBWgONvWImw3lCFUrdEfcS3CKQ6bWOSDvAmcjTCDtTeKGPvaGAjkVsfwZdJQbNEv-jP0EqXjwIMVKpqZldAkedhNQOL4uxXLF7EL4bmqVnMzKTqgqGz4uI2IKfs7Bgg2bDfJ-_k"
          alt="Academic Hallway"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[10s] hover:scale-110"
        />
        
        <div className="relative z-20 flex h-full grow flex-col justify-end p-16 lg:p-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-white/20 bg-white/10 p-10 backdrop-blur-2xl max-w-xl shadow-2xl"
          >
            <div className="mb-6 flex gap-1">
              {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-5 w-5 fill-on-primary text-on-primary" />)}
            </div>
            <p className="mb-8 text-2xl font-medium italic leading-relaxed text-white tracking-tight">
              "Joining EduReg was seamless. The instant access to my courses and schedule is a game changer for student life."
            </p>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container/20 border border-white/30 text-white">
                <UserIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-bold text-white tracking-tight">Freshman Orientation</p>
                <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mt-0.5">Global University of Excellence</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Blurs */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-[120px]" />
        <div className="absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-primary/30 blur-[160px]" />
      </section>
    </div>
  );
}
