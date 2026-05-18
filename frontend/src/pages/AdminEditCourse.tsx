import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Loader2, AlertTriangle } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface CourseForm {
  name: string;
  code: string;
  credits: number;
  description: string;
  faculty: string;
  max_seats: number;
  instructor: string;
  level: string;
  status: string;
}

const FACULTIES = ['Computer Science', 'Mathematics', 'Physics', 'Business', 'Humanities', 'Psychology', 'General'];
const LEVELS = ['Undergraduate', 'Postgraduate', 'Doctoral'];
const STATUSES = ['Open', 'Waitlist', 'Closed'];

export default function AdminEditCourse() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<CourseForm>({
    name: '', code: '', credits: 3, description: '',
    faculty: 'General', max_seats: 50, instructor: '', level: 'Undergraduate', status: 'Open'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchApi(`/courses/${id}`)
      .then(data => setForm({
        name: data.name,
        code: data.code,
        credits: data.credits,
        description: data.description || '',
        faculty: data.faculty || 'General',
        max_seats: data.max_seats || 50,
        instructor: data.instructor || '',
        level: data.level || 'Undergraduate',
        status: data.status || 'Open'
      }))
      .catch(() => setError('Failed to load course.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await fetchApi(`/courses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(form)
      });
      setSuccess(true);
      setTimeout(() => navigate('/admin/courses'), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to save course.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Courses
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden"
      >
        <div className="bg-primary-container px-10 py-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Edit Course</h1>
          <p className="text-white/70 font-medium mt-1">Update details for <span className="font-black text-white">{form.code}</span></p>
        </div>

        <form className="p-10 space-y-8" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center gap-3 rounded-2xl bg-error-container p-4 text-error">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}
          {success && (
            <div className="rounded-2xl bg-green-100 p-4 text-green-700 text-sm font-bold">
              ✓ Course updated! Redirecting...
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Course Name</label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange} required
                className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3.5 text-sm font-semibold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Course Code</label>
              <input
                type="text" name="code" value={form.code} onChange={handleChange} required
                className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3.5 text-sm font-semibold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Credits</label>
              <input
                type="number" name="credits" value={form.credits} onChange={handleChange} min={1} max={8} required
                className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3.5 text-sm font-semibold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Max Seats</label>
              <input
                type="number" name="max_seats" value={form.max_seats} onChange={handleChange} min={1} required
                className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3.5 text-sm font-semibold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Instructor</label>
              <input
                type="text" name="instructor" value={form.instructor} onChange={handleChange}
                className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3.5 text-sm font-semibold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Faculty</label>
              <select name="faculty" value={form.faculty} onChange={handleChange}
                className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3.5 text-sm font-semibold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
              >
                {FACULTIES.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Level</label>
              <select name="level" value={form.level} onChange={handleChange}
                className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3.5 text-sm font-semibold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
              >
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3.5 text-sm font-semibold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
              >
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Description</label>
              <textarea
                name="description" value={form.description} onChange={handleChange} rows={4}
                className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3.5 text-sm font-semibold focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-2xl border border-outline-variant px-8 py-3.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-2xl bg-primary px-10 py-3.5 text-sm font-black text-on-primary shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
