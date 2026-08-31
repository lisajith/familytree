import {
  ChevronRight,
  Download,
  Info,
  Link2,
  Plus,
  TreePine,
  WandSparkles,
} from "lucide-react";

const AppHeader = ({
  handleAutoArrange,
  setShowTreeInfo,
  handleExport,
  selectedPerson,
  nodes,
  setShowRelationshipModal,
  setShowAddPerson,
  handleLogout,
}) => {
  return (
    <header
      className="
        relative z-40
        flex h-16
        items-center
        justify-between
        border-b
        border-slate-200
        bg-white
        px-5
        shadow-sm
      "
    >
      {/* LOGO */}

      <div className="flex items-center gap-3">
        <div
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            bg-slate-900
            text-white
            shadow-sm
          "
        >
          <TreePine size={22} />
        </div>

        <div>
          <h1
            className="
              text-base
              font-bold
              text-slate-900
            "
          >
            FamilyTree
          </h1>

          <p
            className="
              text-xs
              text-slate-400
            "
          >
            My Family Tree
          </p>
        </div>

        <ChevronRight size={15} className="text-slate-300" />
      </div>

      {/* HEADER ACTIONS */}

      <div className="flex items-center gap-2">
        {/* AUTO ARRANGE */}

        <button
          type="button"
          onClick={handleAutoArrange}
          className="
            hidden
            items-center gap-2
            rounded-xl
            bg-slate-900
            px-4 py-2.5
            text-sm
            font-medium
            text-white
            shadow-sm
            transition
            hover:bg-slate-800
            active:scale-95
            md:flex
          "
        >
          <WandSparkles size={17} />
          Auto Arrange
        </button>

        {/* TREE INFO */}

        <button
          type="button"
          onClick={() => setShowTreeInfo(true)}
          className="
            flex items-center gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4 py-2.5
            text-sm
            font-medium
            text-slate-700
            shadow-sm
            transition
            hover:bg-slate-50
          "
        >
          <Info size={17} />

          <span className="hidden sm:inline">Tree Info</span>
        </button>

        {/* EXPORT */}

        <button
          type="button"
          onClick={handleExport}
          className="
            flex items-center gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4 py-2.5
            text-sm
            font-medium
            text-slate-700
            shadow-sm
            transition
            hover:bg-slate-50
          "
        >
          <Download size={17} />

          <span className="hidden sm:inline">Export</span>
        </button>

        {/* ADD RELATIONSHIP */}

        <button
          type="button"
          onClick={() => {
            if (!selectedPerson) {
              alert("Select a family member first.");

              return;
            }

            if (nodes.length < 2) {
              alert("Add at least two family members first.");

              return;
            }

            setShowRelationshipModal(true);
          }}
          className="
            hidden
            items-center gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4 py-2.5
            text-sm
            font-medium
            text-slate-700
            shadow-sm
            transition
            hover:bg-slate-50
            md:flex
          "
        >
          <Link2 size={17} />
          Add Relationship
        </button>

        {/* ADD PERSON */}

        <button
          type="button"
          onClick={() => setShowAddPerson(true)}
          className="
            flex items-center gap-2
            rounded-xl
            bg-slate-900
            px-4 py-2.5
            text-sm
            font-medium
            text-white
            shadow-sm
            transition
            hover:bg-slate-800
            active:scale-95
          "
        >
          <Plus size={18} />

          <span className="hidden sm:inline">Add Person</span>
        </button>

        {/* LOGOUT */}

        <button
          type="button"
          onClick={handleLogout}
          className="
            rounded-xl
            px-4 py-2
            text-sm
            font-semibold
            text-red-600
            transition
            hover:bg-red-500
            hover:text-slate-100
          "
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
