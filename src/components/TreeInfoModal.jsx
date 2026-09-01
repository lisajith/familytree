import { GitBranch, Heart, UsersRound, X } from "lucide-react";

function TreeInfoModal({ open, onClose, nodes = [], edges = [] }) {
  if (!open) {
    return null;
  }

  const spouseRelationships = edges.filter(
    (edge) => edge.data?.relationshipType === "spouse",
  ).length;

  return (
    <div
      className="
        fixed
        inset-0
        z-100
        flex
        items-center
        justify-center
        bg-slate-950/40
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-md
          overflow-hidden
          rounded-3xl
          bg-white
          shadow-2xl
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-100
            px-6
            py-5
          "
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Tree Information
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Overview of your family tree.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              p-2
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* INFORMATION */}

        <div className="space-y-3 p-6">
          {/* FAMILY MEMBERS */}

          <div
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              bg-slate-50
              p-4
            "
          >
            <div className="flex items-center gap-3">
              <UsersRound size={19} className="text-slate-500" />

              <span className="text-sm font-medium text-slate-600">
                Family Members
              </span>
            </div>

            <span className="text-lg font-bold text-slate-900">
              {nodes.length}
            </span>
          </div>

          {/* RELATIONSHIPS */}

          <div
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              bg-slate-50
              p-4
            "
          >
            <div className="flex items-center gap-3">
              <GitBranch size={19} className="text-slate-500" />

              <span className="text-sm font-medium text-slate-600">
                Relationships
              </span>
            </div>

            <span className="text-lg font-bold text-slate-900">
              {edges.length}
            </span>
          </div>

          {/* SPOUSE RELATIONSHIPS */}

          <div
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              bg-slate-50
              p-4
            "
          >
            <div className="flex items-center gap-3">
              <Heart size={19} className="text-slate-500" />

              <span className="text-sm font-medium text-slate-600">
                Spouse Relationships
              </span>
            </div>

            <span className="text-lg font-bold text-slate-900">
              {spouseRelationships}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TreeInfoModal;
