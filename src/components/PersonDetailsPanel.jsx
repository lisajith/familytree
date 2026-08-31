import {
  X,
  UserRound,
  Heart,
  UsersRound,
  Pencil,
  Trash2,
} from "lucide-react";

function PersonDetailsPanel({
  person,
  nodes,
  edges,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!person) {
    return (
      <aside className="flex h-full w-[320px] shrink-0 items-center justify-center border-l border-slate-200 bg-white">
        <div className="px-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <UserRound size={25} />
          </div>

          <p className="font-semibold text-slate-700">
            Select a family member
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Click someone in the tree to view their details.
          </p>
        </div>
      </aside>
    );
  }

  const parents = edges
    .filter(
      (edge) =>
        edge.target === person.id &&
        edge.data?.relationshipType === "parent",
    )
    .map((edge) =>
      nodes.find((node) => node.id === edge.source),
    )
    .filter(Boolean);

  const children = edges
    .filter(
      (edge) =>
        edge.source === person.id &&
        edge.data?.relationshipType === "parent",
    )
    .map((edge) =>
      nodes.find((node) => node.id === edge.target),
    )
    .filter(Boolean);

  const spouses = edges
    .filter(
      (edge) =>
        edge.data?.relationshipType === "spouse" &&
        (edge.source === person.id ||
          edge.target === person.id),
    )
    .map((edge) => {
      const spouseId =
        edge.source === person.id
          ? edge.target
          : edge.source;

      return nodes.find((node) => node.id === spouseId);
    })
    .filter(Boolean);

  const PersonRow = ({
    node,
    relationship,
  }) => (
    <div
      className="
        flex items-center gap-3
        rounded-xl
        bg-slate-50
        px-3 py-3
      "
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
        <UserRound size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">
          {node.data.name}
        </p>

        <p className="text-xs text-slate-400">
          {relationship}
        </p>
      </div>
    </div>
  );

  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col border-l border-slate-200 bg-white">
      {/* HEADER */}

      <div className="flex items-start justify-between border-b border-slate-200 px-5 py-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {person.name}
          </h2>

          <span
            className={`
              mt-2 inline-block
              rounded-md
              px-2 py-1
              text-xs
              font-semibold
              capitalize
              ${
                person.gender === "female"
                  ? "bg-pink-50 text-pink-500"
                  : "bg-blue-50 text-blue-500"
              }
            `}
          >
            {person.gender || "Unknown"}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={19} />
        </button>
      </div>

      {/* TABS */}

      <div className="flex border-b border-slate-200 px-4">
        <button
          className="
            relative flex-1
            py-3
            text-xs font-semibold
            text-blue-600
          "
        >
          Details

          <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600" />
        </button>

        <button
          type="button"
          onClick={() => onEdit?.(person)}
          className="
            flex-1
            py-3
            text-xs font-medium
            text-slate-400
            hover:text-slate-700
          "
        >
          Edit
        </button>

        <button
          className="
            flex-1
            py-3
            text-xs font-medium
            text-slate-400
            hover:text-slate-700
          "
        >
          Relationships
        </button>
      </div>

      {/* CONTENT */}

      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        {/* PARENTS */}

        <section>
          <div className="mb-3 flex items-center gap-2">
            <UsersRound
              size={15}
              className="text-slate-400"
            />

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Parents ({parents.length})
            </p>
          </div>

          <div className="space-y-2">
            {parents.length ? (
              parents.map((parent) => (
                <PersonRow
                  key={parent.id}
                  node={parent}
                  relationship={
                    parent.data.gender === "female"
                      ? "Mother"
                      : parent.data.gender === "male"
                        ? "Father"
                        : "Parent"
                  }
                />
              ))
            ) : (
              <p className="text-sm text-slate-400">
                No parents added
              </p>
            )}
          </div>
        </section>

        {/* SPOUSE */}

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Heart
              size={15}
              className="text-slate-400"
            />

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Spouse ({spouses.length})
            </p>
          </div>

          <div className="space-y-2">
            {spouses.length ? (
              spouses.map((spouse) => (
                <PersonRow
                  key={spouse.id}
                  node={spouse}
                  relationship={
                    spouse.data.gender === "female"
                      ? "Wife"
                      : spouse.data.gender === "male"
                        ? "Husband"
                        : "Spouse"
                  }
                />
              ))
            ) : (
              <p className="text-sm text-slate-400">
                No spouse added
              </p>
            )}
          </div>
        </section>

        {/* CHILDREN */}

        <section>
          <div className="mb-3 flex items-center gap-2">
            <UsersRound
              size={15}
              className="text-slate-400"
            />

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Children ({children.length})
            </p>
          </div>

          <div className="space-y-2">
            {children.length ? (
              children.map((child) => (
                <PersonRow
                  key={child.id}
                  node={child}
                  relationship={
                    child.data.gender === "female"
                      ? "Daughter"
                      : child.data.gender === "male"
                        ? "Son"
                        : "Child"
                  }
                />
              ))
            ) : (
              <p className="text-sm text-slate-400">
                No children added
              </p>
            )}
          </div>
        </section>
      </div>

      {/* FOOTER */}

      <div className="space-y-3 border-t border-slate-200 p-4">
        <button
          type="button"
          onClick={() => onEdit?.(person)}
          className="
            flex w-full
            items-center justify-center
            gap-2
            rounded-xl
            border border-slate-200
            px-4 py-3
            text-sm font-semibold
            text-slate-700
            transition
            hover:bg-slate-50
          "
        >
          <Pencil size={16} />

          Edit Person
        </button>

        <button
          type="button"
          onClick={() => onDelete?.(person)}
          className="
            flex w-full
            items-center justify-center
            gap-2
            rounded-xl
            border border-red-200
            px-4 py-3
            text-sm font-semibold
            text-red-500
            transition
            hover:bg-red-50
          "
        >
          <Trash2 size={16} />

          Delete Person
        </button>
      </div>
    </aside>
  );
}

export default PersonDetailsPanel;