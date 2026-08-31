import dagre from "@dagrejs/dagre";

const NODE_WIDTH = 208;
const NODE_HEIGHT = 130;

const getLayoutedElements = (nodes, edges) => {
  if (!nodes.length) {
    return {
      nodes,
      edges,
    };
  }

  const dagreGraph = new dagre.graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));

  /* ======================================================
     DAGRE CONFIGURATION
  ====================================================== */

  dagreGraph.setGraph({
    rankdir: "TB",

    // Distance between generations
    ranksep: 180,

    // Initial horizontal spacing
    nodesep: 150,

    edgesep: 80,

    marginx: 120,
    marginy: 120,
  });

  /* ======================================================
     ADD NODES
  ====================================================== */

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  /* ======================================================
     PARENT → CHILD EDGES ONLY
  ====================================================== */

  edges.forEach((edge) => {
    if (edge.data?.relationshipType === "parent") {
      dagreGraph.setEdge(edge.source, edge.target);
    }
  });

  /* ======================================================
     RUN DAGRE
  ====================================================== */

  dagre.layout(dagreGraph);

  /* ======================================================
     INITIAL NODE POSITIONS
  ====================================================== */

  let layoutedNodes = nodes.map((node) => {
    const position = dagreGraph.node(node.id);

    if (!position) {
      return {
        ...node,
      };
    }

    return {
      ...node,

      position: {
        x: position.x - NODE_WIDTH / 2,
        y: position.y - NODE_HEIGHT / 2,
      },
    };
  });

  /* ======================================================
     SPOUSE RELATIONSHIPS
  ====================================================== */

  const spouseEdges = edges.filter(
    (edge) => edge.data?.relationshipType === "spouse",
  );

  /*
   * Distance between husband and wife.
   *
   * Smaller = closer.
   */
  const SPOUSE_GAP = 45;

  /*
   * Distance between completely different families.
   *
   * This is the important value for:
   *
   * Family A    Family B    Family C
   *
   */
  const FAMILY_GAP = 180;

  /*
   * Minimum distance between normal people.
   */
  const SINGLE_GAP = 100;

  /* ======================================================
     FIND SPOUSE PAIRS
  ====================================================== */

  const spouseMap = new Map();

  spouseEdges.forEach((edge) => {
    spouseMap.set(edge.source, edge.target);
    spouseMap.set(edge.target, edge.source);
  });

  /* ======================================================
     GROUP PEOPLE BY GENERATION
  ====================================================== */

  const levels = [];

  layoutedNodes.forEach((node) => {
    let level = levels.find(
      (group) =>
        Math.abs(group.y - node.position.y) < NODE_HEIGHT * 0.6,
    );

    if (!level) {
      level = {
        y: node.position.y,
        nodes: [],
      };

      levels.push(level);
    }

    level.nodes.push(node);
  });

  /* ======================================================
     PROCESS EACH GENERATION
  ====================================================== */

  levels.forEach((level) => {
    /*
     * ----------------------------------------------------
     * CREATE FAMILY BLOCKS
     * ----------------------------------------------------
     *
     * Instead of treating every person separately:
     *
     * Ramu
     * Ramana
     * Uma
     *
     * we create:
     *
     * [Ramu + Uma]    [Ramana]
     *
     * This guarantees that Ramana can NEVER be placed
     * between Ramu and Uma.
     */

    const processed = new Set();

    const blocks = [];

    level.nodes.forEach((node) => {
      if (processed.has(node.id)) {
        return;
      }

      const spouseId = spouseMap.get(node.id);

      /*
       * --------------------------------------------------
       * COUPLE
       * --------------------------------------------------
       */

      if (spouseId) {
        const spouse = level.nodes.find(
          (person) => person.id === spouseId,
        );

        /*
         * Only create couple block if spouse is actually
         * in the same generation.
         */

        if (spouse) {
          const first = node;
          const second = spouse;

          /*
           * Preserve Dagre's original left/right order.
           */

          let leftPerson;
          let rightPerson;

          if (first.position.x <= second.position.x) {
            leftPerson = first;
            rightPerson = second;
          } else {
            leftPerson = second;
            rightPerson = first;
          }

          /*
           * Couple block width:
           *
           * 208 + 45 + 208
           *
           * = 461
           */

          const blockWidth =
            NODE_WIDTH * 2 + SPOUSE_GAP;

          const blockLeft =
            (leftPerson.position.x + rightPerson.position.x) / 2 -
            blockWidth / 2;

          /*
           * Put husband and wife together.
           */

          leftPerson.position.x = blockLeft;

          rightPerson.position.x =
            blockLeft + NODE_WIDTH + SPOUSE_GAP;

          /*
           * Exactly same generation.
           */

          const averageY =
            (leftPerson.position.y + rightPerson.position.y) / 2;

          leftPerson.position.y = averageY;
          rightPerson.position.y = averageY;

          blocks.push({
            type: "couple",

            nodes: [leftPerson, rightPerson],

            x: blockLeft,

            width: blockWidth,

            y: averageY,
          });

          processed.add(first.id);
          processed.add(second.id);

          return;
        }
      }

      /*
       * --------------------------------------------------
       * SINGLE PERSON
       * --------------------------------------------------
       */

      blocks.push({
        type: "single",

        nodes: [node],

        x: node.position.x,

        width: NODE_WIDTH,

        y: node.position.y,
      });

      processed.add(node.id);
    });

    /* ====================================================
       SORT FAMILY BLOCKS
    ==================================================== */

    blocks.sort((a, b) => a.x - b.x);

    /* ====================================================
       PLACE FAMILY BLOCKS
    ==================================================== */

    let currentX = 0;

    blocks.forEach((block, index) => {
      /*
       * First family starts at currentX.
       */

      if (index === 0) {
        currentX = block.x;
      }

      /*
       * Different family blocks get a large gap.
       */

      if (index > 0) {
        currentX +=
          blocks[index - 1].width +
          (block.type === "couple" ||
          blocks[index - 1].type === "couple"
            ? FAMILY_GAP
            : SINGLE_GAP);
      }

      const difference = currentX - block.x;

      /*
       * Move EVERY member of the block together.
       *
       * This is the key part.
       */

      block.nodes.forEach((node) => {
        node.position.x += difference;
      });

      block.x = currentX;
    });

    /* ====================================================
       CENTER THE GENERATION
    ==================================================== */

    if (blocks.length > 0) {
      const left = Math.min(
        ...blocks.map((block) => block.x),
      );

      const right = Math.max(
        ...blocks.map(
          (block) => block.x + block.width,
        ),
      );

      const center = (left + right) / 2;

      blocks.forEach((block) => {
        block.nodes.forEach((node) => {
          node.position.x -= center;
        });

        block.x -= center;
      });
    }
  });

  /* ======================================================
     FINAL VERTICAL SPACING
  ====================================================== */

  levels.sort((a, b) => a.y - b.y);

  const VERTICAL_GAP = 80;

  for (let i = 1; i < levels.length; i++) {
    const previousLevel = levels[i - 1];
    const currentLevel = levels[i];

    const previousBottom = Math.max(
      ...previousLevel.nodes.map(
        (node) => node.position.y + NODE_HEIGHT,
      ),
    );

    const minimumY =
      previousBottom + VERTICAL_GAP;

    if (currentLevel.y < minimumY) {
      const difference =
        minimumY - currentLevel.y;

      currentLevel.nodes.forEach((node) => {
        node.position.y += difference;
      });

      currentLevel.y += difference;
    }
  }

  return {
    nodes: layoutedNodes,
    edges,
  };
};

/* ======================================================
   PERSON RELATIONSHIPS
====================================================== */

export function getPersonRelationships(
  personId,
  nodes,
  edges,
) {
  const parents = edges
    .filter(
      (edge) =>
        edge.target === personId &&
        edge.data?.relationshipType === "parent",
    )
    .map((edge) =>
      nodes.find(
        (node) => node.id === edge.source,
      ),
    )
    .filter(Boolean);

  const children = edges
    .filter(
      (edge) =>
        edge.source === personId &&
        edge.data?.relationshipType === "parent",
    )
    .map((edge) =>
      nodes.find(
        (node) => node.id === edge.target,
      ),
    )
    .filter(Boolean);

  const spouses = edges
    .filter(
      (edge) =>
        edge.data?.relationshipType === "spouse" &&
        (edge.source === personId ||
          edge.target === personId),
    )
    .map((edge) => {
      const spouseId =
        edge.source === personId
          ? edge.target
          : edge.source;

      return nodes.find(
        (node) => node.id === spouseId,
      );
    })
    .filter(Boolean);

  return {
    parents,
    children,
    spouses,
  };
}

/* ======================================================
   CONNECTED PEOPLE
====================================================== */

export function getConnectedPersonIds(
  personId,
  edges,
) {
  const connectedIds = new Set();

  connectedIds.add(personId);

  edges.forEach((edge) => {
    if (
      edge.source === personId ||
      edge.target === personId
    ) {
      connectedIds.add(edge.source);
      connectedIds.add(edge.target);
    }
  });

  return connectedIds;
}

export { getLayoutedElements };