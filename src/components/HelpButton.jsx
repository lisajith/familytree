import { CircleHelp } from "lucide-react";

function HelpButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        fixed
        bottom-5
        right-5
        z-50
        hidden
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        border
        border-slate-200
        bg-white
        text-slate-500
        shadow-lg
        transition
        hover:bg-slate-50
        hover:text-slate-700
        md:flex
      "
      title="Help"
    >
      <CircleHelp size={19} />
    </button>
  );
}

export default HelpButton;
