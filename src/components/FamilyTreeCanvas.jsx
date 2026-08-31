import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";

import { WandSparkles } from "lucide-react";

function FamilyTreeCanvas({
  nodes,
  edges,
  selectedPerson,
  searchQuery,
  getConnectedPersonIds,
  getRenderedEdge,
  nodeTypes,
  edgeTypes,
  onInit,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  onPaneClick,
  handleAutoArrange,
  reactFlowInstance,
  NODE_WIDTH,
  NODE_HEIGHT,
}) {
  return (
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
        onInit={onInit}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => {
          const person = nodes.find((item) => item.id === node.id);

          if (person) {
            onNodeClick(person);
          }
        }}
        onPaneClick={onPaneClick}
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

      {/* MOBILE / CENTER AUTO ARRANGE */}

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
  );
}

export default FamilyTreeCanvas;
