import { IconBox } from '../../utils/helpers'; 

const SIZES = {
  sm: { ring: 'h-6 w-6', border: 'border-2', icon: 'h-2.5 w-2.5' },
  md: { ring: 'h-10 w-10', border: 'border-[2.5px]', icon: 'h-4 w-4' },
  lg: { ring: 'h-16 w-16', border: 'border-[3px]', icon: 'h-6 w-6' },
};

const Loader = ({ size = 'md', label, fullScreen = false }) => {
  const s = SIZES[size] ?? SIZES.md;

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${s.ring}`}>
        {/* faint static ring */}
        <div className={`absolute inset-0 rounded-full ${s.border} border-[#232A38]`} />
        {/* animated arc — teal leading into orange */}
        <div
          className={`absolute inset-0 animate-spin rounded-full ${s.border} border-transparent border-t-[#34D1BF] border-r-[#FF6B1A]`}
        />
        {/* center mark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <IconBox className={`${s.icon} text-[#8B93A1]`} />
        </div>
      </div>

      {label && (
        <p className="font-['JetBrains_Mono'] text-xs tracking-wide text-[#8B93A1]">
          {label}
        </p>
      )}
    </div>
  );

  if (!fullScreen) return spinner;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0E14]/90 backdrop-blur-sm">
      {spinner}
    </div>
  );
};

export default Loader;