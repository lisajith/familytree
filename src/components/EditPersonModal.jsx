import { LoaderCircle, X } from "lucide-react";

function EditPersonModal({
  open,
  person,
  personName,
  setPersonName,
  personGender,
  setPersonGender,
  onClose,
  onSubmit,
  saving,
}) {
  if (!open || !person) {
    return null;
  }

  const handleClose = () => {
    setPersonName("");
    setPersonGender("unknown");
    onClose();
  };

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
              Edit Family Member
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Update this person's information.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
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

        {/* FORM */}

        <form onSubmit={onSubmit} className="space-y-5 p-6">
          {/* NAME */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full name
            </label>

            <input
              type="text"
              value={personName}
              onChange={(event) => setPersonName(event.target.value)}
              autoFocus
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                px-4
                py-3
                text-sm
                outline-none
                transition
                focus:border-slate-400
                focus:ring-4
                focus:ring-slate-100
              "
            />
          </div>

          {/* GENDER */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Gender
            </label>

            <select
              value={personGender}
              onChange={(event) => setPersonGender(event.target.value)}
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-sm
                outline-none
                focus:border-slate-400
                focus:ring-4
                focus:ring-slate-100
              "
            >
              <option value="unknown">Prefer not to specify</option>

              <option value="male">Male</option>

              <option value="female">Female</option>

              <option value="other">Other</option>
            </select>
          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="
                rounded-xl
                px-4
                py-2.5
                text-sm
                font-medium
                text-slate-600
                transition
                hover:bg-slate-100
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!personName.trim() || saving}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-slate-900
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-slate-800
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {saving && <LoaderCircle size={16} className="animate-spin" />}

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPersonModal;
