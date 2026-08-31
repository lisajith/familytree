import { useEffect, useMemo, useState } from "react";

import { Link2, X, UserRound, Heart, ArrowDown, ArrowUp } from "lucide-react";

function RelationshipModal({
  open,
  onClose,
  people,
  selectedPerson,
  existingRelationships = [],
  onSave,
  saving,
}) {
  const [relatedPersonId, setRelatedPersonId] = useState("");

  const [relationshipType, setRelationshipType] = useState("");

  /* ====================================================
     RESET
  ==================================================== */

  useEffect(() => {
    if (open) {
      setRelatedPersonId("");
      setRelationshipType("");
    }
  }, [open]);

  /* ====================================================
     SELECTED PERSON
  ==================================================== */

  const selected = people.find((person) => person.id === selectedPerson?.id);

  /* ====================================================
     RELATED PERSON
  ==================================================== */

  const relatedPerson = people.find((person) => person.id === relatedPersonId);

  /* ====================================================
     EXISTING RELATIONSHIP
  ==================================================== */

  const existingRelationship = useMemo(() => {
    if (!selected || !relatedPerson) {
      return null;
    }

    return existingRelationships.find((edge) => {
      const type = edge.data?.relationshipType;

      const sameDirection =
        edge.source === selected.id && edge.target === relatedPerson.id;

      const reverseDirection =
        edge.source === relatedPerson.id && edge.target === selected.id;

      /*
       * Spouse is bidirectional.
       */

      if (type === "spouse") {
        return sameDirection || reverseDirection;
      }

      /*
       * Parent is directional
       * in the database.
       */

      if (type === "parent") {
        return sameDirection || reverseDirection;
      }

      return false;
    });
  }, [selected, relatedPerson, existingRelationships]);

  /* ====================================================
     RELATIONSHIP OPTIONS
  ==================================================== */

  const relationshipOptions = useMemo(() => {
    if (!selected || !relatedPerson) {
      return [];
    }

    if (existingRelationship) {
      return [];
    }

    const selectedGender = selected.gender;

    const options = [];

    /* ==================================================
         CHILD OF
      ================================================== */

    options.push({
      value: "child_of",

      label:
        selectedGender === "female"
          ? "Daughter of"
          : selectedGender === "male"
            ? "Son of"
            : "Child of",

      description: `${selected.name} is the ${
        selectedGender === "female"
          ? "daughter"
          : selectedGender === "male"
            ? "son"
            : "child"
      } of ${relatedPerson.name}`,

      icon: ArrowUp,
    });

    /* ==================================================
         PARENT OF
      ================================================== */

    options.push({
      value: "parent_of",

      label:
        selectedGender === "female"
          ? "Mother of"
          : selectedGender === "male"
            ? "Father of"
            : "Parent of",

      description: `${selected.name} is the ${
        selectedGender === "female"
          ? "mother"
          : selectedGender === "male"
            ? "father"
            : "parent"
      } of ${relatedPerson.name}`,

      icon: ArrowDown,
    });

    /* ==================================================
         SPOUSE
      ================================================== */

    options.push({
      value: "spouse_of",

      label:
        selectedGender === "male"
          ? "Husband of"
          : selectedGender === "female"
            ? "Wife of"
            : "Spouse of",

      description: `${selected.name} is the ${
        selectedGender === "male"
          ? "husband"
          : selectedGender === "female"
            ? "wife"
            : "spouse"
      } of ${relatedPerson.name}`,

      icon: Heart,
    });

    return options;
  }, [selected, relatedPerson, existingRelationship]);

  /* ====================================================
     SUBMIT
  ==================================================== */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selected || !relatedPerson || !relationshipType) {
      return;
    }

    let personId = selected.id;

    let relatedId = relatedPerson.id;

    let databaseRelationship = "spouse";

    /* ==================================================
       CHILD OF

       selected = child
       related = parent

       DB:
       person_id = child
       related_person_id = parent
    ================================================== */

    if (relationshipType === "child_of") {
      databaseRelationship = "parent";
    }

    /* ==================================================
       PARENT OF

       selected = parent
       related = child

       DB:
       person_id = child
       related_person_id = parent

       So reverse them.
    ================================================== */

    if (relationshipType === "parent_of") {
      databaseRelationship = "parent";

      const temp = personId;

      personId = relatedId;

      relatedId = temp;
    }

    /* ==================================================
       SPOUSE
    ================================================== */

    if (relationshipType === "spouse_of") {
      databaseRelationship = "spouse";
    }

    onSave({
      personId,

      relatedPersonId: relatedId,

      relationshipType: databaseRelationship,
    });
  };

  /* ====================================================
     PREVIEW
  ==================================================== */

  const selectedOption = relationshipOptions.find(
    (option) => option.value === relationshipType,
  );

  /* ====================================================
     CLOSED
  ==================================================== */

  if (!open) {
    return null;
  }

  /* ====================================================
     UI
  ==================================================== */

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center
        justify-center
        bg-slate-950/40
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full max-w-lg
          overflow-hidden
          rounded-3xl
          bg-white
          shadow-2xl
        "
      >
        {/* =================================================
            HEADER
        ================================================== */}

        <div
          className="
            flex items-center
            justify-between
            border-b
            border-slate-100
            px-6 py-5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10
                items-center
                justify-center
                rounded-xl
                bg-slate-900
                text-white
              "
            >
              <Link2 size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Add Family Relationship
              </h2>

              <p className="mt-0.5 text-sm text-slate-400">
                Tell us how these people are related.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl p-2
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================== */}

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* SELECTED PERSON */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Family member
            </label>

            <div
              className="
                flex items-center gap-3
                rounded-2xl
                border border-slate-200
                bg-slate-50
                p-4
              "
            >
              <div
                className="
                  flex h-11 w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-slate-500
                  shadow-sm
                "
              >
                <UserRound size={20} />
              </div>

              <div>
                <p className="font-semibold text-slate-800">{selected?.name}</p>

                {selected?.gender && selected.gender !== "unknown" && (
                  <p className="text-xs capitalize text-slate-400">
                    {selected.gender}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RELATED PERSON */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Related to
            </label>

            <select
              value={relatedPersonId}
              onChange={(event) => {
                setRelatedPersonId(event.target.value);

                setRelationshipType("");
              }}
              className="
                w-full rounded-xl
                border border-slate-200
                bg-white px-4 py-3
                text-sm outline-none
                transition
                focus:border-slate-400
                focus:ring-4
                focus:ring-slate-100
              "
            >
              <option value="">Choose a family member</option>

              {people
                .filter((person) => person.id !== selected?.id)
                .map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
            </select>
          </div>

          {/* EXISTING RELATIONSHIP */}

          {relatedPerson && existingRelationship && (
            <div
              className="
                  rounded-2xl
                  border border-amber-200
                  bg-amber-50
                  p-4
                "
            >
              <p className="text-sm font-semibold text-amber-800">
                Relationship already exists
              </p>

              <p className="mt-1 text-xs text-amber-700">
                These two family members are already connected.
              </p>
            </div>
          )}

          {/* RELATIONSHIP OPTIONS */}

          {relatedPerson && !existingRelationship && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                How is {selected.name} related to {relatedPerson.name}?
              </label>

              <div className="grid gap-2">
                {relationshipOptions.map((option) => {
                  const Icon = option.icon;

                  const active = relationshipType === option.value;

                  return (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => setRelationshipType(option.value)}
                      className={`
                            flex items-center
                            gap-3 rounded-2xl
                            border p-3
                            text-left
                            transition
                            ${
                              active
                                ? "border-slate-900 bg-slate-900 text-white shadow-md"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                            }
                          `}
                    >
                      <div
                        className={`
                              flex h-10 w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              ${
                                active
                                  ? "bg-white/10 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }
                            `}
                      >
                        <Icon size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold">{option.label}</p>

                        <p
                          className={`
                                mt-0.5 text-xs
                                ${active ? "text-white/70" : "text-slate-400"}
                              `}
                        >
                          {option.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PREVIEW */}

          {selectedOption && !existingRelationship && (
            <div
              className="
                  rounded-2xl
                  border border-slate-100
                  bg-slate-50
                  p-4
                "
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Relationship preview
              </p>

              <div
                className="
                    flex items-center
                    gap-2 text-sm
                    font-medium
                    text-slate-700
                  "
              >
                <span>{selected.name}</span>

                <span className="text-slate-300">→</span>

                <span>{selectedOption.label}</span>

                <span className="text-slate-300">→</span>

                <span>{relatedPerson.name}</span>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                {selectedOption.description}
              </p>
            </div>
          )}

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl px-4
                py-2.5 text-sm
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
              disabled={
                !relatedPersonId ||
                !relationshipType ||
                saving ||
                !!existingRelationship
              }
              className="
                rounded-xl
                bg-slate-900
                px-5 py-2.5
                text-sm font-medium
                text-white
                transition
                hover:bg-slate-800
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {saving ? "Creating..." : "Create Relationship"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RelationshipModal;
