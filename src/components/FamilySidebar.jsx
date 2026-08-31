import {
  Search,
  Plus,
  Users,
  Heart,
  UserRound,
  GitBranch,
  X,
} from "lucide-react";

import { useState } from "react";

function FamilySidebar({
  nodes = [],
  edges = [],
  selectedPerson,
  setSelectedPerson,
  searchQuery = "",
  setSearchQuery,
  onAddPerson,
  onAddRelationship,
}) {
  const [activeTab, setActiveTab] = useState("people");

  const filteredPeople = (nodes || []).filter((node) =>
    node.data.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const relationshipList = (edges || [])
    .map((edge) => {
      const source = nodes.find((node) => node.id === edge.source);
      const target = nodes.find((node) => node.id === edge.target);

      if (!source || !target) {
        return null;
      }

      return {
        ...edge,
        sourceName: source.data.name,
        targetName: target.data.name,
      };
    })
    .filter(Boolean);

  return (
    <aside
      className="
        flex
        h-full
        w-[330px]
        shrink-0
        flex-col
        border-r
        border-slate-200
        bg-white
      "
    >
      {/* ==================================================
          TABS
      ================================================== */}

      <div className="flex border-b border-slate-200">
        {/* PEOPLE */}

        <button
          type="button"
          onClick={() => setActiveTab("people")}
          className={`
            relative
            flex-1
            px-4
            py-4
            text-sm
            font-semibold
            transition
            ${
              activeTab === "people"
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-800"
            }
          `}
        >
          People
          {activeTab === "people" && (
            <span
              className="
                absolute
                bottom-0
                left-4
                right-4
                h-0.5
                rounded-full
                bg-blue-600
              "
            />
          )}
        </button>

        {/* RELATIONSHIPS */}

        <button
          type="button"
          onClick={() => setActiveTab("relationships")}
          className={`
            relative
            flex-1
            px-4
            py-4
            text-sm
            font-semibold
            transition
            ${
              activeTab === "relationships"
                ? "text-blue-600"
                : "text-slate-500 hover:text-slate-800"
            }
          `}
        >
          Relationships
          {activeTab === "relationships" && (
            <span
              className="
                absolute
                bottom-0
                left-4
                right-4
                h-0.5
                rounded-full
                bg-blue-600
              "
            />
          )}
        </button>
      </div>

      {/* ==================================================
          SEARCH
      ================================================== */}

      <div className="p-4">
        <div
          className="
            relative
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            px-3
            py-3
            shadow-sm
          "
        >
          <Search size={18} className="shrink-0 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={
              activeTab === "people"
                ? "Search people..."
                : "Search relationships..."
            }
            className="
              min-w-0
              flex-1
              bg-transparent
              text-sm
              text-slate-700
              outline-none
              placeholder:text-slate-400
            "
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="
                text-slate-400
                transition
                hover:text-slate-700
              "
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="min-h-0 flex-1 overflow-y-auto px-3">
        {/* ==================================================
            PEOPLE TAB
        ================================================== */}

        {activeTab === "people" && (
          <>
            <div className="mb-3 px-2">
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Family Members ({filteredPeople.length})
              </p>
            </div>

            <div className="space-y-1">
              {filteredPeople.map((node) => {
                const active = selectedPerson?.id === node.id;

                const gender = node.data.gender || "unknown";

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => {
                      setSelectedPerson({
                        id: node.id,
                        name: node.data.name,
                        gender: gender,
                      });
                    }}
                    className={`
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      py-2.5
                      text-left
                      transition
                      ${active ? "bg-blue-50" : "hover:bg-slate-50"}
                    `}
                  >
                    {/* AVATAR */}

                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        ${
                          gender === "female"
                            ? "border-pink-200 bg-pink-50 text-pink-500"
                            : gender === "male"
                              ? "border-blue-200 bg-blue-50 text-blue-500"
                              : "border-slate-200 bg-slate-100 text-slate-500"
                        }
                      `}
                    >
                      <UserRound size={20} />
                    </div>

                    {/* INFO */}

                    <div className="min-w-0 flex-1">
                      <p
                        className={`
                          truncate
                          text-sm
                          font-semibold
                          ${active ? "text-blue-700" : "text-slate-800"}
                        `}
                      >
                        {node.data.name}
                      </p>

                      <p
                        className={`
                          mt-1
                          text-xs
                          capitalize
                          ${
                            gender === "female"
                              ? "text-pink-500"
                              : gender === "male"
                                ? "text-blue-500"
                                : "text-slate-400"
                          }
                        `}
                      >
                        {gender === "unknown" ? "Family member" : gender}
                      </p>
                    </div>

                    {/* SELECTED INDICATOR */}

                    {active && (
                      <span
                        className="
                          h-2
                          w-2
                          shrink-0
                          rounded-full
                          bg-blue-500
                        "
                      />
                    )}
                  </button>
                );
              })}

              {!filteredPeople.length && (
                <div className="px-3 py-8 text-center">
                  <Users size={28} className="mx-auto mb-2 text-slate-300" />

                  <p className="text-sm text-slate-400">
                    No family members found
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ==================================================
            RELATIONSHIPS TAB
        ================================================== */}

        {activeTab === "relationships" && (
          <>
            <div className="mb-3 px-2">
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Relationships ({relationshipList.length})
              </p>
            </div>

            <div className="space-y-2">
              {relationshipList
                .filter((relationship) => {
                  if (!searchQuery.trim()) {
                    return true;
                  }

                  const search = searchQuery.toLowerCase();

                  return (
                    relationship.sourceName?.toLowerCase().includes(search) ||
                    relationship.targetName?.toLowerCase().includes(search)
                  );
                })
                .map((relationship) => (
                  <button
                    key={relationship.id}
                    type="button"
                    onClick={() => {
                      const node = nodes.find(
                        (item) => item.id === relationship.source,
                      );

                      if (node) {
                        setSelectedPerson({
                          id: node.id,
                          name: node.data.name,
                          gender: node.data.gender || "unknown",
                        });
                      }
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-slate-100
                      bg-slate-50
                      p-3
                      text-left
                      transition
                      hover:border-slate-200
                      hover:bg-white
                    "
                  >
                    {/* ICON */}

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-slate-500
                        shadow-sm
                      "
                    >
                      {relationship.data?.relationshipType === "spouse" ? (
                        <Heart size={16} />
                      ) : (
                        <GitBranch size={16} />
                      )}
                    </div>

                    {/* RELATIONSHIP */}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {relationship.sourceName}
                      </p>

                      <p className="text-xs text-slate-400">
                        {relationship.data?.relationshipType === "spouse"
                          ? "spouse of"
                          : "parent of"}
                      </p>

                      <p className="truncate text-sm font-medium text-slate-600">
                        {relationship.targetName}
                      </p>
                    </div>
                  </button>
                ))}

              {relationshipList.length === 0 && (
                <div className="px-3 py-10 text-center">
                  <GitBranch size={28} className="mx-auto text-slate-300" />

                  <p className="mt-3 text-sm font-medium text-slate-600">
                    No relationships yet
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Add a relationship to see it here.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ==================================================
          ACTIONS
      ================================================== */}

      <div className="space-y-3 border-t border-slate-200 p-4">
        <button
          type="button"
          onClick={onAddPerson}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-slate-900
            px-4
            py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-slate-800
            active:scale-[0.98]
          "
        >
          <Plus size={18} />
          Add Person
        </button>

        <button
          type="button"
          onClick={onAddRelationship}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-3
            text-sm
            font-semibold
            text-slate-700
            transition
            hover:bg-slate-50
            active:scale-[0.98]
          "
        >
          <Heart size={17} />
          Add Relationship
        </button>
      </div>
    </aside>
  );
}

export default FamilySidebar;
