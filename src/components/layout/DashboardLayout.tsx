import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Home, ChevronDown, Building2, Calendar, Users, BookOpen } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

const sidebarSections = [
  {
    title: "Room Management",
    key: "rooms",
    icon: Building2,
    items: [
      { name: "Room List", path: "/dashboard/rooms" },
      { name: "Create Room", path: "/dashboard/rooms/create" },
    ],
  },
  {
    title: "Slots Management",
    key: "slots",
    icon: Calendar,
    items: [{ name: "Slots List", path: "/dashboard/slots" }],
  },
  {
    title: "Booking Management",
    key: "bookings",
    icon: BookOpen,
    items: [{ name: "Booking List", path: "/dashboard/bookings" }],
  },
  {
    title: "User Management",
    key: "users",
    icon: Users,
    items: [{ name: "Users", path: "/dashboard/users" }],
  },
];

interface SidebarItemProps {
  title: string;
  icon: React.ComponentType<any>;
  items: Array<{ name: string; path: string }>;
  isOpen: boolean;
  toggleOpen: () => void;
  currentPath: string;
  onItemClick: (path: string) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  title,
  icon: Icon,
  items,
  isOpen,
  toggleOpen,
  currentPath,
  onItemClick,
}) => {
  const hasActiveChild = items.some((item) => currentPath === item.path);
  console.log(items);

  return (
    <div className="mb-2">
      <button
        onClick={toggleOpen}
        className={`group flex items-center justify-between w-full p-4 text-left rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-slate-900/20 ${
          hasActiveChild 
            ? "bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-700 shadow-lg shadow-violet-500/10 border border-violet-200/50" 
            : "text-slate-300 hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 hover:text-white hover:border hover:border-slate-500/30"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg transition-all duration-300 group-hover:rotate-3 group-hover:scale-110 ${
            hasActiveChild 
              ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25" 
              : "bg-slate-700 text-slate-400 group-hover:bg-gradient-to-br group-hover:from-violet-500 group-hover:to-purple-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-violet-500/25"
          }`}>
            <Icon size={18} />
          </div>
          <span className="font-semibold text-sm tracking-wide">{title}</span>
        </div>
        <ChevronDown 
          size={18} 
          className={`transition-all duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          } ${hasActiveChild ? "text-violet-600" : "text-slate-400 group-hover:text-slate-200"}`}
        />
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? "max-h-64 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="ml-12 space-y-2 relative">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-slate-600 via-slate-500 to-transparent"></div>
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => onItemClick(item.path)}
              className={`relative block w-full text-left px-6 py-3 text-sm rounded-lg transition-all duration-300 font-medium ${
                currentPath === item.path
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 transform translate-x-1"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/60 hover:translate-x-1"
              }`}
            >
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 ${
                currentPath === item.path ? "bg-white -translate-x-4" : "bg-slate-500 -translate-x-3"
              }`}></div>
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const DashboardLayout: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentPath, setCurrentPath] = useState("/dashboard/rooms");
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    rooms: true,
    slots: false,
    bookings: false,
    users: false,
  });

  const navigate = useNavigate()

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleItemClick = (path: string) => {
    setCurrentPath(path);
    setShowSidebar(false);
    
    const section = sidebarSections.find(s => 
      s.items.some(item => item.path === path)
    );
    if (section && !openSections[section.key]) {
      setOpenSections(prev => ({ ...prev, [section.key]: true }));
    }
    navigate(path)
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setShowSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            RoomReserve
          </h1>
        </div>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          {showSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {showSidebar && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-80 
          bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          transform transition-all duration-500 ease-out
          ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col shadow-2xl
        `}
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-700/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                RoomReserve
              </h1>
              <p className="text-slate-400 text-sm font-medium">Management Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
          <nav className="space-y-3">
            {sidebarSections.map((section) => (
              <SidebarItem
                key={section.key}
                title={section.title}
                icon={section.icon}
                items={section.items}
                isOpen={openSections[section.key]}
                toggleOpen={() => toggleSection(section.key)}
                currentPath={currentPath}
                onItemClick={handleItemClick}
              />
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50">
          <button
            onClick={() => navigate("/")}
            className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all duration-300 font-medium border border-slate-700 hover:border-slate-600 hover:shadow-lg"
          >
            <Home size={18} className="group-hover:scale-110 transition-transform duration-300" />
            Back to Home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-0 pt-20 md:pt-0">
        <div className="p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <Outlet/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;