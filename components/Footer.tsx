
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-16 px-6 border-t" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-sm">
          <div className="text-3xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>
            Altis<span style={{ color: 'var(--bg-accent-strong)' }}>.</span>
          </div>
          <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            The next generation of fixed income. Secure your future with the world's most stable assets, tokenized for everyone.
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-6">
          <div className="flex gap-8">
            <a href="#" className="text-sm font-bold uppercase tracking-widest transition-colors hover:opacity-70" style={{ color: 'var(--text-primary)' }}>Twitter</a>
            <a href="#" className="text-sm font-bold uppercase tracking-widest transition-colors hover:opacity-70" style={{ color: 'var(--text-primary)' }}>Discord</a>
            <a href="#" className="text-sm font-bold uppercase tracking-widest transition-colors hover:opacity-70" style={{ color: 'var(--text-primary)' }}>GitHub</a>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-left md:text-right" style={{ color: 'var(--text-muted)' }}>
            © 2025 Altis Protocol. <br />
            This is an educational demo project. Not financial advice.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
