import { useRef, useState } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { uploadSiteImage } from '../../../lib/settingsService';

// ── Shared input styles ───────────────────────────────────────────────────────
export const INPUT_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 10,
  color: 'rgba(255,255,255,0.85)',
  padding: '10px 14px',
  fontSize: 14,
  width: '100%',
  outline: 'none',
};

// ── Field wrapper ─────────────────────────────────────────────────────────────
export function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {hint && <span className="text-[11px] text-white/30">{hint}</span>}
    </div>
  );
}

// ── Text input ────────────────────────────────────────────────────────────────
export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...INPUT_STYLE, ...(props.style ?? {}) }} />;
}

// ── Textarea ──────────────────────────────────────────────────────────────────
export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...INPUT_STYLE, resize: 'none', ...(props.style ?? {}) }} />;
}

// ── Select ────────────────────────────────────────────────────────────────────
export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={{ ...INPUT_STYLE, ...(props.style ?? {}) }} />;
}

// ── Toggle ─────────────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange, label, sub }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; sub?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-left transition-all w-full"
      style={{
        background: checked ? 'rgba(212,175,55,0.07)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${checked ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.07)'}`,
      }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: checked ? '#d4af37' : 'rgba(255,255,255,0.7)' }}>{label}</p>
        {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
      </div>
      <div className="w-10 h-5.5 rounded-full flex-shrink-0 transition-colors relative" style={{ background: checked ? '#d4af37' : 'rgba(255,255,255,0.12)', height: 22 }}>
        <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: checked ? 'calc(100% - 18px)' : 2 }} />
      </div>
    </button>
  );
}

// ── Color input ───────────────────────────────────────────────────────────────
export function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2.5">
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-11 h-11 rounded-lg cursor-pointer flex-shrink-0"
        style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.09)' }}
      />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="#d4af37"
        style={{ ...INPUT_STYLE, flex: 1 }}
      />
    </div>
  );
}

// ── Image upload ──────────────────────────────────────────────────────────────
export function ImageUpload({ value, onChange, label, folder, aspect = 'aspect-video' }: {
  value: string; onChange: (url: string) => void; label: string; folder: string; aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadSiteImage(file, folder);
      onChange(url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Field label={label}>
      <div className="flex flex-col gap-3">
        <div
          className={`relative ${aspect} w-full max-w-xs rounded-xl overflow-hidden group`}
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)' }}
        >
          {value ? (
            <>
              <img src={value} alt={label} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                style={{ background: 'rgba(0,0,0,0.6)', color: '#f87171', backdropFilter: 'blur(8px)' }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/20">
              <ImageIcon className="w-8 h-8" />
              <span className="text-xs">No image</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-60"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37' }}
          >
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {uploading ? 'Uploading…' : 'Upload Image'}
          </button>
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="or paste image URL"
            style={{ ...INPUT_STYLE, flex: 1 }}
          />
        </div>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    </Field>
  );
}

// ── Array editor (for string lists) ────────────────────────────────────────────
export function StringListEditor({ values, onChange, placeholder }: {
  values: string[]; onChange: (v: string[]) => void; placeholder?: string;
}) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const t = draft.trim();
    if (!t) return;
    onChange([...values, t]);
    setDraft('');
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder ?? 'Add item…'}
          style={{ ...INPUT_STYLE, flex: 1 }}
        />
        <button type="button" onClick={add} className="px-4 py-2.5 rounded-xl text-xs font-semibold" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37' }}>
          Add
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((v, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.7)' }}>
              {v}
              <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="text-white/30 hover:text-red-400 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Key-value list editor (for footer links) ────────────────────────────────────
export function LinkListEditor({ values, onChange }: {
  values: { label: string; url: string }[]; onChange: (v: { label: string; url: string }[]) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {values.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            value={item.label}
            onChange={e => { const n = [...values]; n[i] = { ...n[i], label: e.target.value }; onChange(n); }}
            placeholder="Label"
            style={{ ...INPUT_STYLE, flex: 1 }}
          />
          <input
            value={item.url}
            onChange={e => { const n = [...values]; n[i] = { ...n[i], url: e.target.value }; onChange(n); }}
            placeholder="https://…"
            style={{ ...INPUT_STYLE, flex: 1.5 }}
          />
          <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="p-2.5 rounded-xl text-white/30 hover:text-red-400 transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, { label: '', url: '' }])}
        className="self-start px-4 py-2 rounded-xl text-xs font-semibold"
        style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)', color: '#d4af37' }}
      >
        + Add Link
      </button>
    </div>
  );
}
