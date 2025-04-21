import React, { useState, useEffect } from "react";
import {
  createCompany,
  getCompaniesSize,
  getCompaniesProvince,
  updateCompany,
} from "../../services/companyService";

const AddCompanyModal = ({
  showModal,
  setShowModal,
  mode,
  editingCompany,
  onSave,
}) => {
  const [companySizes, setCompanySizes] = useState([]);
  const [companyProvinces, setCompanyProvinces] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    provinces: "",
    size: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sizes = await getCompaniesSize();
        const provinces = await getCompaniesProvince();
        setCompanySizes(sizes);
        setCompanyProvinces(provinces);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (editingCompany) {
      setFormData({
        name: editingCompany.name,
        province: editingCompany.province,
        size: editingCompany.size,
      });
    } else {
      setFormData({ name: "", province: "", size: "" });
    }
  }, [editingCompany]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (mode === "edit" && editingCompany) {
        response = await updateCompany(editingCompany.id, formData);
        onSave({ ...formData, id: editingCompany.id }, "edit");
      } else {
        response = await createCompany(formData);
        onSave({ ...formData, id: response.id }, "add");
      }
      e.target.reset(); // ✅ This clears the form fields

      setShowModal(false);
    } catch (error) {
      console.error("Error saving company:", error);
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
                  {mode === "edit" ? "Edit Company" : "Add New Company"}
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
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Company Province</label>
                    <select
                      name="province"
                      className="form-select"
                      value={formData.province}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Province</option>
                      {companyProvinces.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>{" "}
                  <div className="mb-3">
                    <label className="form-label">Company Size</label>
                    <select
                      name="size"
                      className="form-select"
                      value={formData.size}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Size</option>
                      {companySizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
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
                      {mode === "edit" ? "Update Company" : "Save Company"}
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

export default AddCompanyModal;
