import { useCallback, useEffect, useMemo, useState } from "react";

import {
  BezierEdge,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import "@xyflow/react/dist/style.css";

import { LoaderCircle } from "lucide-react";

/* ======================================================
   PAGES
====================================================== */

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

/* ======================================================
   COMPONENTS
====================================================== */

import FamilyNode from "./components/FamilyNode";
import FamilySidebar from "./components/FamilySidebar";
import PersonDetailsPanel from "./components/PersonDetailsPanel";
import RelationshipModal from "./components/RelationshipModal";
import AppHeader from "./components/AppHeader";
import AddPersonModal from "./components/AddPersonModal";
import EditPersonModal from "./components/EditPersonModal";
import TreeInfoModal from "./components/TreeInfoModal";
import HelpButton from "./components/HelpButton";
import FamilyTreeWorkspace from "./components/FamilyTreeWorkspace";

/* ======================================================
   SUPABASE
====================================================== */

import { supabase } from "./lib/supabase";

/* ======================================================
   UTILITIES
====================================================== */

import {
  getLayoutedElements,
  getPersonRelationships,
  getConnectedPersonIds,
} from "./utils/familyTreeLayout";

/* ======================================================
   CONSTANTS
====================================================== */

const NODE_WIDTH = 208;
const NODE_HEIGHT = 130;

/* ======================================================
   NODE TYPES
====================================================== */

const nodeTypes = {
  familyMember: FamilyNode,
};

/* ======================================================
   EDGE TYPES
====================================================== */

const edgeTypes = {
  bezier: BezierEdge,
};

/* ======================================================
   MAIN APP
====================================================== */

function App() {
  return (
    <BrowserRouter>
      <ReactFlowProvider>
        <AppContent />
      </ReactFlowProvider>
    </BrowserRouter>
  );
}

/* ======================================================
   APP CONTENT
====================================================== */

function AppContent() {
  const navigate = useNavigate();

  /* ====================================================
     AUTH
  ==================================================== */

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  /* ====================================================
     SIDEBAR
  ==================================================== */

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  /* ====================================================
     TREE
  ==================================================== */

  const [treeId, setTreeId] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  /* ====================================================
     SELECTION
  ==================================================== */

  const [selectedPerson, setSelectedPerson] = useState(null);

  const [infoPerson, setInfoPerson] = useState(null);

  const [detailsTab, setDetailsTab] = useState("details");

  /* ====================================================
     MODALS
  ==================================================== */

  const [showRelationshipModal, setShowRelationshipModal] = useState(false);

  const [showAddPerson, setShowAddPerson] = useState(false);

  const [showEditPerson, setShowEditPerson] = useState(false);

  const [showTreeInfo, setShowTreeInfo] = useState(false);

  /* ====================================================
     EDIT PERSON
  ==================================================== */

  const [editingPerson, setEditingPerson] = useState(null);

  const [personName, setPersonName] = useState("");

  const [personGender, setPersonGender] = useState("unknown");

  /* ====================================================
     LOADING
  ==================================================== */

  const [saving, setSaving] = useState(false);

  const [savingRelationship, setSavingRelationship] = useState(false);

  const [loading, setLoading] = useState(true);

  /* ====================================================
     REACT FLOW INSTANCE
  ==================================================== */

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  /* ====================================================
     AUTH CHECK
  ==================================================== */

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Auth error:", error);

        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /* ====================================================
     DELETE PERSON
  ==================================================== */

  const handleDeletePerson = useCallback(
    async (person) => {
      if (!person) {
        return;
      }

      const confirmed = window.confirm(
        `Delete ${person.name} from the family tree?\n\nAll relationships connected to this person will also be removed.`,
      );

      if (!confirmed) {
        return;
      }

      try {
        setSaving(true);

        /* DELETE RELATIONSHIPS */

        const { error: relationshipError } = await supabase
          .from("relationships")
          .delete()
          .eq("tree_id", treeId)
          .or(`person_id.eq.${person.id},related_person_id.eq.${person.id}`);

        if (relationshipError) {
          throw relationshipError;
        }

        /* DELETE PERSON */

        const { error: personError } = await supabase
          .from("people")
          .delete()
          .eq("id", person.id);

        if (personError) {
          throw personError;
        }

        /* REMOVE NODE */

        setNodes((currentNodes) =>
          currentNodes.filter((node) => node.id !== person.id),
        );

        /* REMOVE EDGES */

        setEdges((currentEdges) =>
          currentEdges.filter(
            (edge) => edge.source !== person.id && edge.target !== person.id,
          ),
        );

        /* CLEAR SELECTION */

        setSelectedPerson((current) =>
          current?.id === person.id ? null : current,
        );

        setInfoPerson((current) =>
          current?.id === person.id ? null : current,
        );
      } catch (error) {
        console.error("Error deleting person:", error);

        alert(error.message || "Unable to delete person.");
      } finally {
        setSaving(false);
      }
    },
    [treeId, setNodes, setEdges],
  );

  /* ====================================================
     CREATE NODE DATA
  ==================================================== */

  const createNodeData = useCallback(
    (person) => ({
      name: person.name,

      gender: person.gender,

      person,

      onSelect: (selectedPersonData) => {
        if (!selectedPersonData) {
          return;
        }

        setSelectedPerson({
          id: selectedPersonData.id,

          name: selectedPersonData.name,

          gender: selectedPersonData.gender || "unknown",
        });

        setDetailsTab("details");
      },

      onInfo: (selectedPersonData) => {
        if (!selectedPersonData) {
          return;
        }

        setInfoPerson(selectedPersonData);

        setSelectedPerson({
          id: selectedPersonData.id,

          name: selectedPersonData.name,

          gender: selectedPersonData.gender || "unknown",
        });

        setDetailsTab("details");
      },

      onEdit: (selectedPersonData) => {
        if (!selectedPersonData) {
          return;
        }

        setEditingPerson(selectedPersonData);

        setPersonName(selectedPersonData.name);

        setPersonGender(selectedPersonData.gender || "unknown");

        setShowEditPerson(true);
      },

      onDelete: handleDeletePerson,
    }),
    [handleDeletePerson],
  );

  /* ====================================================
     LOAD PEOPLE
  ==================================================== */

  const loadPeople = useCallback(
    async (id) => {
      const { data, error } = await supabase
        .from("people")
        .select("*")
        .eq("tree_id", id);

      if (error) {
        console.error("Error loading people:", error);

        return;
      }

      const formattedNodes = (data || []).map((person, index) => ({
        id: person.id,

        type: "familyMember",

        position: {
          x: (index % 5) * 300,

          y: Math.floor(index / 5) * 220 + 100,
        },

        data: createNodeData(person),
      }));

      setNodes(formattedNodes);
    },
    [createNodeData, setNodes],
  );

  /* ====================================================
     LOAD RELATIONSHIPS
  ==================================================== */

  const loadRelationships = useCallback(
    async (id) => {
      const { data, error } = await supabase
        .from("relationships")
        .select("*")
        .eq("tree_id", id);

      if (error) {
        console.error("Error loading relationships:", error);

        return;
      }

      const formattedEdges = (data || []).map((relationship) => {
        let source;
        let target;

        if (relationship.relationship_type === "parent") {
          source = relationship.related_person_id;

          target = relationship.person_id;
        } else {
          source = relationship.person_id;

          target = relationship.related_person_id;
        }

        return {
          id: relationship.id,

          source,

          target,

          type: "bezier",

          animated: false,

          data: {
            relationshipType: relationship.relationship_type,
          },
        };
      });

      setEdges(formattedEdges);
    },
    [setEdges],
  );

  /* ====================================================
     INITIALIZE TREE
  ==================================================== */

  const initializeTree = useCallback(
    async (userId) => {
      try {
        setLoading(true);

        const { data: existingTree, error: fetchError } = await supabase
          .from("family_trees")
          .select("id")
          .eq("owner_id", userId)
          .limit(1)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        /* EXISTING TREE */

        if (existingTree) {
          setTreeId(existingTree.id);

          await loadPeople(existingTree.id);

          await loadRelationships(existingTree.id);

          return;
        }

        /* CREATE TREE */

        const { data: newTree, error: createError } = await supabase
          .from("family_trees")
          .insert({
            name: "My Family Tree",

            description: "My first family tree",

            owner_id: userId,
          })
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        setTreeId(newTree.id);

        setNodes([]);

        setEdges([]);
      } catch (error) {
        console.error("Tree initialization error:", error);
      } finally {
        setLoading(false);
      }
    },
    [loadPeople, loadRelationships, setNodes, setEdges],
  );

  /* ====================================================
     INITIALIZE WHEN USER EXISTS
  ==================================================== */

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    initializeTree(user.id);
  }, [authLoading, user?.id, initializeTree]);

  /* ====================================================
     SELECT PERSON
  ==================================================== */

  const handleSelectPerson = useCallback(
    (person) => {
      if (!person) {
        return;
      }

      const selected = {
        id: person.id,

        name: person.data ? person.data.name : person.name,

        gender: person.data ? person.data.gender : person.gender,
      };

      setSelectedPerson(selected);

      setDetailsTab("details");

      if (reactFlowInstance && person.position) {
        reactFlowInstance.setCenter(
          person.position.x + NODE_WIDTH / 2,

          person.position.y + NODE_HEIGHT / 2,

          {
            zoom: 0.8,

            duration: 500,
          },
        );
      }
    },
    [reactFlowInstance],
  );

  /* ====================================================
     PANE CLICK
  ==================================================== */

  const handlePaneClick = useCallback(() => {
    setSelectedPerson(null);
  }, []);

  /* ====================================================
     SELECTED RELATIONSHIPS
  ==================================================== */

  const selectedRelationships = useMemo(() => {
    if (!selectedPerson) {
      return {
        parents: [],
        children: [],
        spouses: [],
      };
    }

    return getPersonRelationships(selectedPerson.id, nodes, edges);
  }, [selectedPerson, nodes, edges]);

  /* ====================================================
     CONNECTED PERSON IDS
  ==================================================== */

  const connectedPersonIds = useMemo(() => {
    if (!selectedPerson) {
      return new Set();
    }

    return getConnectedPersonIds(selectedPerson.id, edges);
  }, [selectedPerson, edges]);

  /* ====================================================
     RELATIONSHIP NAME
  ==================================================== */

  const getRelationshipLabel = useCallback(
    (edge) => {
      if (!selectedPerson) {
        return "";
      }

      const selectedId = selectedPerson.id;

      /* SPOUSE */

      if (edge.data?.relationshipType === "spouse") {
        if (edge.source === selectedId || edge.target === selectedId) {
          return "Spouse";
        }
      }

      /* PARENT */

      if (edge.data?.relationshipType === "parent") {
        /* SELECTED PERSON IS CHILD */

        if (edge.target === selectedId) {
          const parentNode = nodes.find((node) => node.id === edge.source);

          if (parentNode?.data?.gender === "female") {
            return "Mother";
          }

          if (parentNode?.data?.gender === "male") {
            return "Father";
          }

          return "Parent";
        }

        /* SELECTED PERSON IS PARENT */

        if (edge.source === selectedId) {
          const childNode = nodes.find((node) => node.id === edge.target);

          if (childNode?.data?.gender === "female") {
            return "Daughter";
          }

          if (childNode?.data?.gender === "male") {
            return "Son";
          }

          return "Child";
        }
      }

      return "";
    },
    [selectedPerson, nodes],
  );

  /* ====================================================
     STYLED EDGES
  ==================================================== */

  const displayedEdges = useMemo(() => {
    return edges.map((edge) => {
      const isConnected =
        selectedPerson &&
        connectedPersonIds.has(edge.source) &&
        connectedPersonIds.has(edge.target);

      const isHighlighted =
        selectedPerson &&
        (edge.source === selectedPerson.id ||
          edge.target === selectedPerson.id);

      /* NO SELECTED PERSON */

      if (!selectedPerson) {
        return {
          ...edge,

          animated: false,

          style: {
            stroke: "#94a3b8",

            strokeWidth: 2,
          },

          label: "",

          labelStyle: {
            fill: "#64748b",

            fontSize: 11,

            fontWeight: 600,
          },

          labelBgStyle: {
            fill: "#ffffff",

            fillOpacity: 0.95,
          },
        };
      }

      /* HIGHLIGHTED */

      if (isHighlighted) {
        return {
          ...edge,

          animated: true,

          style: {
            stroke:
              edge.data?.relationshipType === "spouse" ? "#ec4899" : "#2563eb",

            strokeWidth: 3,

            strokeDasharray: "8 6",
          },

          label: getRelationshipLabel(edge),

          labelStyle: {
            fill:
              edge.data?.relationshipType === "spouse" ? "#db2777" : "#2563eb",

            fontSize: 12,

            fontWeight: 700,
          },

          labelBgStyle: {
            fill: "#ffffff",

            fillOpacity: 0.95,
          },

          labelBgPadding: [6, 3],

          labelBgBorderRadius: 6,
        };
      }

      /* CONNECTED */

      if (isConnected) {
        return {
          ...edge,

          animated: false,

          style: {
            stroke: "#cbd5e1",

            strokeWidth: 2,

            opacity: 0.65,
          },

          label: "",
        };
      }

      /* UNRELATED */

      return {
        ...edge,

        animated: false,

        style: {
          stroke: "#e2e8f0",

          strokeWidth: 1.5,

          opacity: 0.35,
        },

        label: "",
      };
    });
  }, [edges, selectedPerson, connectedPersonIds, getRelationshipLabel]);

  /* ====================================================
     GET RENDERED EDGE
  ==================================================== */

  const getRenderedEdge = useCallback(
    (edge) => {
      return displayedEdges.find((item) => item.id === edge.id) || edge;
    },
    [displayedEdges],
  );

  /* ====================================================
     WORKSPACE CONNECTED PERSON FUNCTION
  ==================================================== */

  const getWorkspaceConnectedPersonIds = useCallback(
    (personId) => {
      return getConnectedPersonIds(personId, edges);
    },
    [edges],
  );

  /* ====================================================
     CREATE RELATIONSHIP
  ==================================================== */

  const handleCreateRelationship = async ({
    personId,
    relatedPersonId,
    relationshipType,
  }) => {
    if (!treeId) {
      return;
    }

    try {
      setSavingRelationship(true);

      /* LOCAL DUPLICATE */

      const duplicateExists = edges.some((edge) => {
        const samePeople =
          (edge.source === personId && edge.target === relatedPersonId) ||
          (edge.source === relatedPersonId && edge.target === personId);

        if (!samePeople) {
          return false;
        }

        if (relationshipType === "spouse") {
          return edge.data?.relationshipType === "spouse";
        }

        return (
          edge.data?.relationshipType === "parent" &&
          edge.target === personId &&
          edge.source === relatedPersonId
        );
      });

      if (duplicateExists) {
        alert("This relationship already exists.");

        return;
      }

      /* DATABASE DUPLICATE */

      let query = supabase
        .from("relationships")
        .select("*")
        .eq("tree_id", treeId)
        .eq("relationship_type", relationshipType);

      if (relationshipType === "spouse") {
        query = query.or(
          `and(person_id.eq.${personId},related_person_id.eq.${relatedPersonId}),and(person_id.eq.${relatedPersonId},related_person_id.eq.${personId})`,
        );
      } else {
        query = query
          .eq("person_id", personId)
          .eq("related_person_id", relatedPersonId);
      }

      const { data: existingRelationship, error: checkError } =
        await query.maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingRelationship) {
        alert("This relationship already exists.");

        return;
      }

      /* INSERT */

      const { data, error } = await supabase
        .from("relationships")
        .insert({
          tree_id: treeId,

          person_id: personId,

          related_person_id: relatedPersonId,

          relationship_type: relationshipType,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      let source;
      let target;

      if (relationshipType === "parent") {
        source = relatedPersonId;

        target = personId;
      } else {
        source = personId;

        target = relatedPersonId;
      }

      setEdges((currentEdges) => [
        ...currentEdges,

        {
          id: data.id,

          source,

          target,

          type: "bezier",

          animated: false,

          data: {
            relationshipType,
          },
        },
      ]);

      setShowRelationshipModal(false);
    } catch (error) {
      console.error("Error creating relationship:", error);

      alert(error.message || "Unable to create relationship.");
    } finally {
      setSavingRelationship(false);
    }
  };

  /* ====================================================
     ADD PERSON
  ==================================================== */

  const handleAddPerson = async (event) => {
    event.preventDefault();

    if (!personName.trim() || !treeId) {
      return;
    }

    try {
      setSaving(true);

      const { data, error } = await supabase
        .from("people")
        .insert({
          tree_id: treeId,

          name: personName.trim(),

          gender: personGender,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newNode = {
        id: data.id,

        type: "familyMember",

        position: {
          x: 0,

          y: 100,
        },

        data: createNodeData(data),
      };

      setNodes((currentNodes) => [...currentNodes, newNode]);

      setPersonName("");

      setPersonGender("unknown");

      setShowAddPerson(false);

      /* ARRANGE */

      setTimeout(() => {
        setNodes((currentNodes) => {
          const layout = getLayoutedElements(currentNodes, edges);

          return layout.nodes;
        });

        setTimeout(() => {
          reactFlowInstance?.fitView({
            padding: 0.15,

            duration: 500,

            minZoom: 0.35,

            maxZoom: 1.1,
          });
        }, 50);
      }, 50);
    } catch (error) {
      console.error("Error creating person:", error);

      alert(error.message || "Unable to create person.");
    } finally {
      setSaving(false);
    }
  };

  /* ====================================================
     EDIT PERSON
  ==================================================== */

  const handleEditPerson = async (event) => {
    event.preventDefault();

    if (!editingPerson || !personName.trim()) {
      return;
    }

    try {
      setSaving(true);

      const { data, error } = await supabase
        .from("people")
        .update({
          name: personName.trim(),

          gender: personGender,
        })
        .eq("id", editingPerson.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setNodes((currentNodes) =>
        currentNodes.map((node) => {
          if (node.id !== data.id) {
            return node;
          }

          return {
            ...node,

            data: createNodeData(data),
          };
        }),
      );

      if (infoPerson?.id === data.id) {
        setInfoPerson(data);
      }

      if (selectedPerson?.id === data.id) {
        setSelectedPerson({
          id: data.id,

          name: data.name,

          gender: data.gender,
        });
      }

      setEditingPerson(null);

      setPersonName("");

      setPersonGender("unknown");

      setShowEditPerson(false);
    } catch (error) {
      console.error("Error editing person:", error);

      alert(error.message || "Unable to update person.");
    } finally {
      setSaving(false);
    }
  };

  /* ====================================================
     AUTO ARRANGE
  ==================================================== */

  const handleAutoArrange = useCallback(() => {
    if (!nodes.length) {
      return;
    }

    const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges);

    setNodes(layoutedNodes);

    setTimeout(() => {
      reactFlowInstance?.fitView({
        padding: 0.15,

        duration: 600,

        minZoom: 0.35,

        maxZoom: 1.1,
      });
    }, 50);
  }, [nodes, edges, setNodes, reactFlowInstance]);

  /* ====================================================
     SEARCH
  ==================================================== */

  const filteredPeople = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return nodes;
    }

    return nodes.filter((node) =>
      node.data.name?.toLowerCase().includes(query),
    );
  }, [nodes, searchQuery]);

  /* ====================================================
     EXPORT
  ==================================================== */

  const handleExport = () => {
    const exportData = {
      tree: {
        id: treeId,

        name: "My Family Tree",
      },

      people: nodes.map((node) => ({
        id: node.id,

        name: node.data.name,

        gender: node.data.gender,
      })),

      relationships: edges.map((edge) => ({
        id: edge.id,

        source: edge.source,

        target: edge.target,

        type: edge.data?.relationshipType,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "family-tree.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* ====================================================
     LOGOUT
  ==================================================== */

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);

      setTreeId(null);

      setNodes([]);

      setEdges([]);

      setSelectedPerson(null);

      setInfoPerson(null);

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /* ====================================================
     AUTH LOADING
  ==================================================== */

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoaderCircle size={32} className="animate-spin text-slate-500" />
      </div>
    );
  }

  /* ====================================================
     PUBLIC ROUTES
  ==================================================== */

  if (!user) {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              onLogin={() => navigate("/login")}
              onRegister={() => navigate("/register")}
            />
          }
        />

        <Route
          path="/login"
          element={
            <Login
              onLogin={(loggedInUser) => {
                setUser(loggedInUser);

                navigate("/tree");
              }}
              onRegister={() => navigate("/register")}
            />
          }
        />

        <Route
          path="/register"
          element={<Register onLogin={() => navigate("/login")} />}
        />

        <Route path="/tree" element={<Navigate to="/login" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  /* ====================================================
     AUTHENTICATED ROUTES
  ==================================================== */

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tree" replace />} />

      <Route path="/login" element={<Navigate to="/tree" replace />} />

      <Route path="/register" element={<Navigate to="/tree" replace />} />

      {/* ================================================
          FAMILY TREE
      ================================================ */}

      <Route
        path="/tree"
        element={
          <>
            {loading ? (
              <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex items-center gap-3 text-slate-500">
                  <LoaderCircle size={22} className="animate-spin" />

                  <span>Loading your family tree...</span>
                </div>
              </div>
            ) : (
              <div className="h-screen overflow-hidden bg-slate-50 text-slate-900">
                {/* HEADER */}

                <AppHeader
                  handleAutoArrange={handleAutoArrange}
                  setShowTreeInfo={setShowTreeInfo}
                  handleExport={handleExport}
                  selectedPerson={selectedPerson}
                  nodes={nodes}
                  setShowRelationshipModal={setShowRelationshipModal}
                  setShowAddPerson={setShowAddPerson}
                  handleLogout={handleLogout}
                />

                {/* WORKSPACE */}

                <div className="relative h-[calc(100vh-4rem)] min-h-0">
                  <FamilyTreeWorkspace
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    selectedPerson={selectedPerson}
                    searchQuery={searchQuery}
                    searchQueryValue={searchQuery}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    handleAutoArrange={handleAutoArrange}
                    handleSelectPerson={handleSelectPerson}
                    handlePaneClick={handlePaneClick}
                    setReactFlowInstance={setReactFlowInstance}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    getConnectedPersonIds={getWorkspaceConnectedPersonIds}
                    getRenderedEdge={getRenderedEdge}
                    FamilySidebar={FamilySidebar}
                    setSearchQuery={setSearchQuery}
                    onAddPerson={() => setShowAddPerson(true)}
                    onAddRelationship={() => {
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
                  />

                  {/* RIGHT DETAILS PANEL */}

                  {selectedPerson && (
                    <div className="absolute right-0 top-0 z-30 h-full">
                      <PersonDetailsPanel
                        person={selectedPerson}
                        nodes={nodes}
                        edges={edges}
                        onClose={() => setSelectedPerson(null)}
                        onEdit={(person) => {
                          const actualPerson = nodes.find(
                            (node) => node.id === person.id,
                          );

                          const personData =
                            actualPerson?.data?.person || person;

                          setEditingPerson(personData);

                          setPersonName(personData.name);

                          setPersonGender(personData.gender || "unknown");

                          setShowEditPerson(true);
                        }}
                        onDelete={handleDeletePerson}
                      />
                    </div>
                  )}
                </div>

                {/* ADD PERSON */}

                <AddPersonModal
                  open={showAddPerson}
                  onClose={() => {
                    setShowAddPerson(false);
                  }}
                  personName={personName}
                  setPersonName={setPersonName}
                  personGender={personGender}
                  setPersonGender={setPersonGender}
                  onSubmit={handleAddPerson}
                  saving={saving}
                />

                {/* EDIT PERSON */}

                <EditPersonModal
                  open={showEditPerson}
                  person={editingPerson}
                  personName={personName}
                  setPersonName={setPersonName}
                  personGender={personGender}
                  setPersonGender={setPersonGender}
                  onClose={() => {
                    setShowEditPerson(false);

                    setEditingPerson(null);

                    setPersonName("");

                    setPersonGender("unknown");
                  }}
                  onSubmit={handleEditPerson}
                  saving={saving}
                />

                {/* RELATIONSHIP */}

                <RelationshipModal
                  open={showRelationshipModal}
                  onClose={() => setShowRelationshipModal(false)}
                  people={nodes.map((node) => ({
                    id: node.id,

                    name: node.data.name,

                    gender: node.data.gender,
                  }))}
                  selectedPerson={selectedPerson}
                  existingRelationships={edges}
                  onSave={handleCreateRelationship}
                  saving={savingRelationship}
                />

                {/* TREE INFO */}

                <TreeInfoModal
                  open={showTreeInfo}
                  onClose={() => setShowTreeInfo(false)}
                  nodes={nodes}
                  edges={edges}
                />

                {/* HELP */}

                <HelpButton
                  onClick={() => {
                    alert(
                      "Select a family member to view details. Use Add Person to create a member and Add Relationship to connect people.",
                    );
                  }}
                />
              </div>
            )}
          </>
        }
      />

      {/* UNKNOWN */}

      <Route path="*" element={<Navigate to="/tree" replace />} />
    </Routes>
  );
}

export default App;
