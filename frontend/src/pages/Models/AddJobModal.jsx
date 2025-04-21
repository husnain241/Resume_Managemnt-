import React, { useState, useEffect } from "react";
import { createJob, getJobsLevel, updateJob } from "../../services/jobService"; // change to jobService
import { getCompanies } from "../../services/companyService";

const AddJobModal = ({ showModal, setShowModal, mode, editingJob, onSave }) => {
  const [jobLevels, setJobLevels] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    level: "",
    companyId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const levels = await getJobsLevel(); // get job levels
        const companyList = await getCompanies(); // get companies for the job
        setJobLevels(levels);
        setCompanies(companyList);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (editingJob) {
      setFormData({
        title: editingJob.title,
        level: editingJob.level,
        companyId: editingJob.companyId,
      });
    } else {
      setFormData({ title: "", level: "", companyId: "" });
    }
  }, [editingJob]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      companyId: parseInt(formData.companyId),
    };

    try {
      if (mode === "edit" && editingJob) {
        const updatedJob = await updateJob(editingJob.id, payload);
        const selectedCompany = companies.find(
          (c) => c.id === payload.companyId
        );

        onSave(
          {
            ...payload,
            id: updatedJob.id,
            companyName: selectedCompany?.name || "",
          },
          "edit"
        );
      } else {
        const createdJob = await createJob(payload); // ✅ Wait for the backend response
        onSave(
          {
            ...payload,
            id: createdJob.id,
            companyName: createdJob.companyName, // Use companyName from the response
          },
          "add"
        );
      }
      e.target.reset();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      {showModal && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {mode === "edit" ? "Edit Job" : "Add New Job"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Job Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Job Level</label>
                    <select
                      name="level"
                      className="form-select"
                      value={formData.level}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Level</option>
                      {jobLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Company</label>
                    <select
                      name="companyId"
                      className="form-select"
                      value={formData.companyId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {mode === "edit" ? "Update Job" : "Save Job"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddJobModal;
