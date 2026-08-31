export function getPersonRelationships(personId, nodes, edges) {
  const parents = edges
    .filter(
      (edge) =>
        edge.target === personId && edge.data?.relationshipType === "parent",
    )
    .map((edge) => nodes.find((node) => node.id === edge.source))
    .filter(Boolean);

  const children = edges
    .filter(
      (edge) =>
        edge.source === personId && edge.data?.relationshipType === "parent",
    )
    .map((edge) => nodes.find((node) => node.id === edge.target))
    .filter(Boolean);

  const spouses = edges
    .filter(
      (edge) =>
        edge.data?.relationshipType === "spouse" &&
        (edge.source === personId || edge.target === personId),
    )
    .map((edge) => {
      const spouseId = edge.source === personId ? edge.target : edge.source;

      return nodes.find((node) => node.id === spouseId);
    })
    .filter(Boolean);

  return {
    parents,
    children,
    spouses,
  };
}

export function getConnectedPersonIds(personId, edges) {
  const connectedIds = new Set();

  connectedIds.add(personId);

  edges.forEach((edge) => {
    if (edge.source === personId || edge.target === personId) {
      connectedIds.add(edge.source);
      connectedIds.add(edge.target);
    }
  });

  return connectedIds;
}
