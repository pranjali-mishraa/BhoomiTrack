import type { ReactNode } from "react";

interface SectionCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

const SectionCard = ({
  title,
  description,
  children,
  actions,
  className = "",
}: SectionCardProps) => {
  return (
    <section
      className={`overflow-hidden rounded-md border border-slate-200 bg-white ${className}`}
    >
      {(title || description || actions) && (
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && (
              <h2 className="text-sm font-semibold text-[#0d2d4b]">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex shrink-0 items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        {children}
      </div>
    </section>
  );
};

export default SectionCard;
