import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_DISCIPLINES } from "../utils/queries";
import {
  ADD_DISCIPLINE,
  UPDATE_DISCIPLINE,
  DELETE_DISCIPLINE,
} from "../utils/mutations";

const Disciplines = () => {
  const { data, loading, error, refetch } = useQuery(GET_DISCIPLINES);
  const [addDiscipline] = useMutation(ADD_DISCIPLINE);
  const [updateDiscipline] = useMutation(UPDATE_DISCIPLINE);
  const [deleteDiscipline] = useMutation(DELETE_DISCIPLINE);

  const [newDisciplineName, setNewDisciplineName] = useState("");
  const [editState, setEditState] = useState({});

  if (loading) return <p>Loading disciplines...</p>;
  if (error) return <p>Error loading disciplines!</p>;

  const handleAddDiscipline = async () => {
    if (!newDisciplineName.trim()) return;
    await addDiscipline({ variables: { name: newDisciplineName } });
    setNewDisciplineName("");
    refetch();
  };

  const handleEditClick = (discId, name) => {
    setEditState({ [discId]: name });
  };

  const handleSave = async (discId) => {
    const name = editState[discId];
    if (name && name.trim()) {
      await updateDiscipline({ variables: { discId, name } });
      setEditState({});
      refetch();
    }
  };

  const handleDeleteDiscipline = async (discId) => {
    await deleteDiscipline({ variables: { discId } });
    refetch();
  };

  const handleKeyDown = (event, discId) => {
    if (event.key === "Escape") {
      setEditState({});
    }
  };

  return (
    <main className="main-container">
      <div>
        <h3 className="form-header">Manage Disciplines</h3>
        <div className="form-div">
          <ul>
            {data.disciplines.map((disc) => (
              <li key={disc._id}>
                {editState[disc._id] !== undefined ? (
                  <div className="li-div">
                    <input
                      value={editState[disc._id]}
                      onChange={(e) =>
                        setEditState({
                          ...editState,
                          [disc._id]: e.target.value,
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e, disc._id)}
                      autoFocus
                    />
                    <button
                      className="icon-button"
                      onClick={() => handleSave(disc._id)}
                    >
                      💾
                    </button>
                  </div>
                ) : (
                  <div className="li-div">
                    <span
                      onClick={() => handleEditClick(disc._id, disc.name)}
                      style={{ cursor: "pointer" }}
                    >
                      {disc.name}
                    </span>
                    <button
                      className="icon-button"
                      onClick={() => handleDeleteDiscipline(disc._id)}
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div className="li-div">
            <input
              value={newDisciplineName}
              onChange={(e) => setNewDisciplineName(e.target.value)}
              placeholder="Discipline name"
            />
            <button className="icon-button" onClick={handleAddDiscipline}>
              ➕
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Disciplines;
