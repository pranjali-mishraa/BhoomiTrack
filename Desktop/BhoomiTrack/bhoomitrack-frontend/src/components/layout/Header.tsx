const Header = () => {
    return (
      <header className="fixed inset-x-0 top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:left-[250px]">
        {/* Government Identity */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-[11px] font-bold text-[#123b63]">
            भारत
          </div>
  
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-500">
              Government of India
            </p>
  
            <h1 className="truncate text-xl font-bold leading-6 text-[#0d2d4b]">
              BhoomiTrack
            </h1>
  
            <span className="hidden text-[11px] text-slate-500 sm:block">
              National Land Acquisition Monitoring System
            </span>
          </div>
        </div>
  
        {/* Portal Information */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="text-right">
            <span className="block text-[10px] text-slate-400">
              National Land Acquisition
            </span>
  
            <strong className="text-xs font-semibold text-[#123b63]">
              Monitoring Portal
            </strong>
          </div>
  
          <div className="h-7 w-px bg-slate-200" />
  
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center border border-slate-200 bg-white text-xs font-bold text-[#123b63] transition hover:bg-slate-50"
            aria-label="Accessibility options"
          >
            A
          </button>
        </div>
      </header>
    );
  };
  
  export default Header;