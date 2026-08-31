import { Menu, X } from "lucide-react";

function SidebarToggle({ sidebarOpen, setSidebarOpen }) {
  return (
    <button
      type="button"
      onClick={() => setSidebarOpen((prev) => !prev)}
      className="
        absolute
        left-4
        top-4
        z-50
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-xl
        border
        border-slate-200
        bg-white
        text-slate-700
        shadow-lg
        transition-all
        duration-200
        hover:bg-slate-50
        hover:shadow-xl
        active:scale-95
      "
      title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
    >
      {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  );
}

export default SidebarToggle;
