import React, { useEffect, useReducer, useState } from "react";
import { getJobs, deleteJob } from "../services/jobService"; // change to jobService
import AddJobModal from "../pages/Models/AddJobModal"; // change to AddJobModal

const jobsReducer = (state, action) => {
  switch (action.type) {
    case "SET_JOBS":
      return action.payload;
    case "ADD_JOB":
      return [...state, action.payload];
    case "DELETE_JOB":
      return state.filter((job) => job.id !== action.payload);
    case "UPDATE_JOB":
      return state.map((job) =>
        job.id === action.payload.id ? action.payload : job
      );
    default:
      return state;
  }
};

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, dispatch] = useReducer(jobsReducer, []);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        dispatch({ type: "SET_JOBS", payload: data });
      } catch (error) {
        console.error("Error loading jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleOnDelete = async (id) => {
    try {
      const response = await deleteJob(id); // changed to deleteJob
      dispatch({ type: "DELETE_JOB", payload: response.id });
    } catch (error) {
      console.error("Error deleting job", error);
    }
  };

  const handleOnEdit = (job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  const handleSave = (job, mode) => {
    if (mode === "add") {
      dispatch({ type: "ADD_JOB", payload: job });
    } else if (mode === "edit") {
      dispatch({ type: "UPDATE_JOB", payload: job });
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Jobs</h2>

      <button
        className="btn btn-success mb-4"
        onClick={() => {
          setEditingJob(null);
          setShowModal(true);
        }}
      >
        Add Job
      </button>

      <AddJobModal
        showModal={showModal}
        setShowModal={setShowModal}
        mode={editingJob ? "edit" : "add"}
        editingJob={editingJob}
        onSave={handleSave}
      />

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search job by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="list-group">
        {filteredJobs.map((job) => (
          <li
            key={job.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <h5 className="mb-1">{job.title}</h5>
              <p className="mb-0">Level: {job.level}</p>
              <p className="mb-0">Company: {job.companyName}</p>
            </div>
            <div>
              <button
                className="btn btn-primary me-2"
                onClick={() => handleOnEdit(job)}
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleOnDelete(job.id)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Jobs;
