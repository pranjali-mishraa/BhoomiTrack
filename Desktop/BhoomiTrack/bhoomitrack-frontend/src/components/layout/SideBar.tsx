import { NavLink } from "react-router-dom";

interface SidebarItem {
  label: string;
  path: string;
}

const mainNavigation: SidebarItem[] = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Projects", path: "/projects" },
  { label: "Proposals", path: "/proposals" },
  { label: "Land Parcels", path: "/land-parcels" },
  { label: "GIS & Mapping", path: "/gis" },
  { label: "Notifications", path: "/notifications" },
];

const acquisitionNavigation: SidebarItem[] = [
  { label: "Awards", path: "/awards" },
  { label: "Compensation", path: "/compensation" },
  { label: "Possession", path: "/possession" },
  { label: "Rehabilitation & R&R", path: "/rr" },
  { label: "Milestones", path: "/milestones" },
];

const managementNavigation: SidebarItem[] = [
  { label: "Reports", path: "/reports" },
  { label: "Documents", path: "/documents" },
  { label: "Audit Trail", path: "/audit" },
];

const SidebarSection = ({
  title,
  items,
}: {
  title: string;
  items: SidebarItem[];
}) => {
  return (
    <div className="mb-6">
      <p className="mb-2 px-3 text-[10px] font-semibold tracking-wider text-slate-400">
        {title}
      </p>

      <nav className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              [
                "block border-l-2 px-3 py-2.5 text-sm transition",
                isActive
                  ? "border-white bg-white/10 font-semibold text-white"
                  : "border-transparent text-slate-300 hover:border-slate-500 hover:bg-white/5 hover:text-white",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] bg-[#0d2d4b] text-white lg:block">
      {/* Brand */}
      <div className="flex h-[76px] items-center border-b border-white/10 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-white/20 bg-white/10 text-[10px] font-bold">
            भारत
          </div>

          <div>
            <h2 className="text-base font-bold tracking-wide">
              BhoomiTrack
            </h2>

            <p className="text-[10px] uppercase tracking-wider text-slate-300">
              NLAMS
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="h-[calc(100vh-76px)] overflow-y-auto px-3 py-5">
        <SidebarSection
          title="LAND ACQUISITION"
          items={mainNavigation}
        />

        <SidebarSection
          title="ACQUISITION PROCESS"
          items={acquisitionNavigation}
        />

        <SidebarSection
          title="ADMINISTRATION"
          items={managementNavigation}
        />
      </div>
    </aside>
  );
};

export default Sidebar;