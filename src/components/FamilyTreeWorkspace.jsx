import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";

import { Menu, WandSparkles, X } from "lucide-react";

const FamilyTreeWorkspace = ({
  nodes,
  edges,
  nodeTypes,
  edgeTypes,
  selectedPerson,
  searchQuery,
  sidebarOpen,
  setSidebarOpen,
  handleAutoArrange,
  handleSelectPerson,
  handlePaneClick,
  setReactFlowInstance,
  onNodesChange,
  onEdgesChange,
  getConnectedPersonIds,
  getRenderedEdge,
  FamilySidebar,
  searchQueryValue,
  setSearchQuery,
  onAddPerson,
  onAddRelationship,
}) => {
  return (
    <div
      className="
        relative
        h-[calc(100vh-4rem)]
        overflow-hidden
      "
    >
      {/* ==================================================
          SIDEBAR TOGGLE
      ================================================== */}

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

      {/* ==================================================
          LEFT SIDEBAR
      ================================================== */}

      <div
        className={`
          absolute
          left-0
          top-0
          z-40
          h-full
          transition-transform
          duration-300
          ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <FamilySidebar
          nodes={nodes}
          edges={edges}
          selectedPerson={selectedPerson}
          setSelectedPerson={handleSelectPerson}
          searchQuery={searchQueryValue}
          setSearchQuery={setSearchQuery}
          onAddPerson={onAddPerson}
          onAddRelationship={onAddRelationship}
        />
      </div>

      {/* ==================================================
          REACT FLOW
      ================================================== */}

      <main
        className="
          absolute
          inset-0
          overflow-hidden
        "
      >
        <ReactFlow
          nodes={nodes.map((node) => {
            const connectedIds = selectedPerson
              ? getConnectedPersonIds(selectedPerson.id)
              : null;

            const isSearchMatch =
              !searchQuery ||
              node.data.name?.toLowerCase().includes(searchQuery.toLowerCase());

            const isConnected = !selectedPerson || connectedIds?.has(node.id);

            const isSelected = selectedPerson?.id === node.id;

            return {
              ...node,

              className: !isSearchMatch
                ? "family-dimmed"
                : isSelected
                  ? "family-selected"
                  : isConnected
                    ? "family-connected"
                    : "family-dimmed",
            };
          })}
          edges={edges.map(getRenderedEdge)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onInit={setReactFlowInstance}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => {
            const person = nodes.find((item) => item.id === node.id);

            if (person) {
              handleSelectPerson(person);
            }
          }}
          onPaneClick={handlePaneClick}
          fitView
          fitViewOptions={{
            padding: 0.08,
            minZoom: 0.35,
            maxZoom: 1,
          }}
          minZoom={0.2}
          maxZoom={2}
        >
          <Background gap={24} size={1} color="#e2e8f0" />

          <Controls position="bottom-left" showInteractive={false} />

          <MiniMap
            position="bottom-right"
            nodeColor={() => "#64748b"}
            maskColor="rgba(248,250,252,0.75)"
          />
        </ReactFlow>

        {/* ==================================================
            MOBILE / CENTER AUTO ARRANGE
        ================================================== */}

        <button
          type="button"
          onClick={handleAutoArrange}
          className="
            absolute
            bottom-6
            left-1/2
            z-20
            -translate-x-1/2
            flex
            items-center
            gap-2
            rounded-2xl
            border
            border-slate-200
            bg-white/95
            px-5
            py-3
            text-sm
            font-semibold
            text-slate-700
            shadow-xl
            backdrop-blur
            transition
            hover:bg-white
            active:scale-95
          "
        >
          <WandSparkles size={17} />
          Auto Arrange
        </button>
      </main>
    </div>
  );
};

export default FamilyTreeWorkspace;
