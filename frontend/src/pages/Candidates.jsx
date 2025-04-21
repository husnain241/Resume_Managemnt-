// src/pages/Candidates.jsx
import React, { useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { getCandidates, deleteCandidate } from "../services/candidateService";
import AddCandidateModal from "../pages/Models/AddCandidateModal";

const candidatesReducer = (state, action) => {
  switch (action.type) {
    case "SET_CANDIDATES":
      return action.payload;
    case "DELETE_CANDIDATE":
      return state.filter((candidate) => candidate.id !== action.payload);
    case "UPDATE_CANDIDATE":
      return state.map((candidate) =>
        candidate.id === action.payload.id ? action.payload : candidate
      );
    case "ADD_CANDIDATE":
      return [...state, action.payload];
    default:
      return state;
  }
};

const Candidates = () => {
  const [candidates, dispatch] = useReducer(candidatesReducer, []);
  const [editingCandidate, setEditingCandidate] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const data = await getCandidates();
      dispatch({ type: "SET_CANDIDATES", payload: data });
    } catch (error) {
      console.error("Error loading candidates:", error);
    }
  };

  const handleOnDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?"))
      return;

    try {
      await deleteCandidate(id);
      dispatch({ type: "DELETE_CANDIDATE", payload: id });
    } catch (error) {
      console.error("Error deleting candidate", error);
    }
  };

  const handleSave = (candidate, mode) => {
    if (mode === "add") {
      dispatch({ type: "ADD_CANDIDATE", payload: candidate });
    } else if (mode === "edit") {
      dispatch({ type: "UPDATE_CANDIDATE", payload: candidate });
    }
    setEditingCandidate(null); // close modal after save
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🎯 Candidate Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/candidate")}
        >
          ➕ Add Candidate
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-3">📋 Candidate List</h4>

          {candidates.length === 0 ? (
            <p className="text-muted">No candidates found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Job Role</th>
                    <th>CV</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr key={candidate.id}>
                      <td>{candidate.id}</td>
                      <td>
                        {candidate.firstName} {candidate.lastName}
                      </td>
                      <td>{candidate.email}</td>
                      <td>{candidate.phone}</td>
                      <td>{candidate.jobTitle}</td>
                      <td>
                        {candidate.resumeUrl ? (
                          <a
                            href={`https://localhost:7129/${candidate.resumeUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                          >
                            View CV
                          </a>
                        ) : (
                          <span className="text-muted">No CV</span>
                        )}
                      </td>
                      <td>
                        <div>
                          <button
                            className="btn btn-primary me-2"
                            onClick={() =>
                              navigate(`/candidate/${candidate.id}`)
                            }
                          >
                            <i className="fas fa-edit"></i>
                          </button>

                          <button
                            className="btn btn-danger"
                            onClick={() => handleOnDelete(candidate.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editingCandidate && (
        <AddCandidateModal
          mode={editingCandidate.id ? "edit" : "add"} // if it has an ID, it's edit mode
          editingJob={editingCandidate}
          onSave={handleSave}
          onClose={() => setEditingCandidate(null)}
        />
      )}
    </div>
  );
};

export default Candidates;
