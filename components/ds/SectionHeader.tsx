interface SectionHeaderProps {
  title:        string;
  description?: string;
  actions?:     React.ReactNode;
  meta?:        React.ReactNode;
  className?:   string;
  size?:        'sm' | 'md' | 'lg';
}

const TITLE_SIZE = { sm: 'text-base', md: 'text-xl', lg: 'text-2xl' };

export function SectionHeader({ title, description, actions, meta, className = '', size = 'md' }: SectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-5 flex-wrap ${className}`}>
      <div className="min-w-0">
        <h3
          className={`text-white font-bold leading-snug ${TITLE_SIZE[size]}`}
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          {title}
        </h3>
        {description && (
          <p className="text-white/30 text-xs mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
        {meta}
        {actions}
      </div>
    </div>
  );
}
