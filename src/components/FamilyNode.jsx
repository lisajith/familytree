import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { MoreVertical, UserRound, Info, Pencil, Trash2 } from "lucide-react";

function FamilyNode({ data, selected }) {
  const [showMenu, setShowMenu] = useState(false);

  const gender = data.gender || "unknown";

  const genderColor =
    gender === "female"
      ? "text-pink-500"
      : gender === "male"
        ? "text-blue-500"
        : "text-slate-500";

  const avatarBackground =
    gender === "female"
      ? "bg-pink-50"
      : gender === "male"
        ? "bg-blue-50"
        : "bg-slate-100";

  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
        data.onSelect?.(data.person);
      }}
      className={`
        relative
        w-52
        rounded-2xl
        border
        bg-white
        p-4
        transition-all
        duration-200
        cursor-pointer
        ${
          selected
            ? "border-blue-500 shadow-2xl ring-4 ring-blue-500/20"
            : "border-slate-200 shadow-lg hover:-translate-y-1 hover:shadow-xl"
        }
      `}
    >
      {/* TOP HANDLE */}

      <Handle
        type="target"
        position={Position.Top}
        className={`
          !h-2 !w-2 !border-2 !border-white
          ${selected ? "!bg-blue-500" : "!bg-slate-400"}
        `}
      />

      {/* INFO */}

      <button
        type="button"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();

          setShowMenu(false);
          data.onInfo?.(data.person);
        }}
        className={`
          absolute left-2 top-2 rounded-lg p-1.5
          transition
          ${
            selected
              ? "text-blue-500 hover:bg-blue-50"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          }
        `}
        title="View information"
      >
        <Info size={16} />
      </button>

      {/* THREE DOT MENU */}

      <div className="absolute right-2 top-2">
        <button
          type="button"
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            setShowMenu((current) => !current);
          }}
          className="
            rounded-lg
            p-1.5
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-slate-700
          "
          title="More options"
        >
          <MoreVertical size={17} />
        </button>

        {showMenu && (
          <div
            className="
              absolute right-0 top-9 z-50
              w-36
              overflow-hidden
              rounded-xl
              border border-slate-200
              bg-white
              p-1
              shadow-xl
            "
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                setShowMenu(false);
                data.onEdit?.(data.person);
              }}
              className="
                flex w-full items-center gap-2
                rounded-lg px-3 py-2
                text-left text-sm text-slate-700
                transition hover:bg-slate-100
              "
            >
              <Pencil size={15} />
              Edit
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                setShowMenu(false);
                data.onDelete?.(data.person);
              }}
              className="
                flex w-full items-center gap-2
                rounded-lg px-3 py-2
                text-left text-sm text-red-600
                transition hover:bg-red-50
              "
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* AVATAR */}

      <div
        className={`
          mx-auto mb-3 flex h-14 w-14
          items-center justify-center
          rounded-full
          ${avatarBackground}
          ${genderColor}
          transition-all duration-200
          ${selected ? "shadow-lg ring-2 ring-blue-100" : ""}
        `}
      >
        <UserRound size={27} />
      </div>

      {/* NAME */}

      <div className="text-center">
        <h3
          className={`
            truncate font-semibold
            ${selected ? "text-blue-700" : "text-slate-800"}
          `}
        >
          {data.name}
        </h3>

        {gender !== "unknown" && (
          <p
            className={`
              mt-1 text-xs capitalize
              ${selected ? "text-blue-400" : genderColor}
            `}
          >
            {gender}
          </p>
        )}
      </div>

      {/* SELECTED */}

      {selected && (
        <div className="mt-3 text-center">
          <span
            className="
              rounded-full bg-blue-50 px-3 py-1
              text-[10px] font-semibold text-blue-600
            "
          >
            Selected
          </span>
        </div>
      )}

      {/* BOTTOM HANDLE */}

      <Handle
        type="source"
        position={Position.Bottom}
        className={`
          !h-2 !w-2 !border-2 !border-white
          ${selected ? "!bg-blue-500" : "!bg-slate-400"}
        `}
      />
    </div>
  );
}

export default FamilyNode;
