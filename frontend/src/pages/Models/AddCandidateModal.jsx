import React, { useCallback, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCandidateById,
  createCandidate,
  updateCandidate,
} from "../../services/candidateService";
import { getJobs } from "../../services/jobService";

const CandidateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [candidate, setCandidate] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    jobId: "", // ✅ make sure this exists and is set
    jobTitle: "Software Developer",
    coverLetter: "I am very excited to apply!",
    resumeFile: null,
  });

  const [jobs, setJobs] = useState([]);

  const loadCandidate = useCallback(async () => {
    try {
      const data = await getCandidateById(id);
      setCandidate((prev) => ({
        ...prev,
        ...data,
        resumeFile: null,
      }));
    } catch (error) {
      console.error("Failed to load candidate", error);
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobList = await getJobs();
        setJobs(jobList);
      } catch (err) {
        console.error("Error loading jobs:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      loadCandidate();
    }
  }, [isEditMode, loadCandidate]);

  const handleChange = (e) => {
    setCandidate({ ...candidate, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCandidate({ ...candidate, resumeFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", candidate.firstName);
    formData.append("lastName", candidate.lastName);
    formData.append("email", candidate.email);
    formData.append("phone", candidate.phone);
    formData.append("jobId", candidate.jobId);
    formData.append("coverLetter", candidate.coverLetter);
    if (candidate.resumeFile) {
      formData.append("pdfFile", candidate.resumeFile);
    }

    try {
      if (isEditMode) {
        await updateCandidate(id, formData);
        alert("Candidate updated!");
      } else {
        await createCandidate(formData);
        alert("Candidate added!");
      }
      navigate("/candidates");
    } catch (error) {
      console.error("Failed to save candidate", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold">
        {isEditMode ? "✏️ Update Candidate" : "➕ Add Candidate"}
      </h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label>First Name</label>
          <input
            name="firstName"
            value={candidate.firstName}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Last Name</label>
          <input
            name="lastName"
            value={candidate.lastName}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={candidate.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Phone</label>
          <input
            name="phone"
            value={candidate.phone}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Job</label>
          <select
            name="jobId"
            className="form-select"
            value={candidate.jobId}
            onChange={handleChange}
            required
          >
            <option value="">Select Job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Cover Letter</label>
          <textarea
            name="coverLetter"
            value={candidate.coverLetter}
            onChange={handleChange}
            className="form-control"
            rows="3"
            required
          />
        </div>

        <div className="mb-3">
          <label>Upload CV</label>
          <input
            placeholder="Only PDF file is acceptable..."
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-success">
          {isEditMode ? "Update" : "Add"} Candidate
        </button>
      </form>
    </div>
  );
};

export default CandidateForm;
