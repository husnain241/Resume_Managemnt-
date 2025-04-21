import React, { useEffect, useReducer, useState } from "react";
import { getCompanies, deleteCompany } from "../services/companyService";
import AddCompanyModal from "../pages/Models/AddCompanyModal";

const companiesReducer = (state, action) => {
  switch (action.type) {
    case "SET_COMPANIES":
      return action.payload;
    case "ADD_COMPANY":
      return [...state, action.payload];
    case "DELETE_COMPANY":
      return state.filter((company) => company.id !== action.payload);
    case "UPDATE_COMPANY":
      return state.map((company) =>
        company.id === action.payload.id ? action.payload : company
      );
    default:
      return state;
  }
};

const Companies = () => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const [companies, dispatch] = useReducer(companiesReducer, []);
  const [showModal, setShowModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedComSize, setSelectedComSize] = useState("");

  const [editingCompany, setEditingCompany] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        dispatch({ type: "SET_COMPANIES", payload: data });
      } catch (error) {
        console.error("Error loading companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleOnDelete = async (id) => {
    try {
      const response = await deleteCompany(id);
      dispatch({ type: "DELETE_COMPANY", payload: response.id });
    } catch (error) {
      console.error("Error deleting company", error);
    }
  };

  const handleOnEdit = (company) => {
    setEditingCompany(company);
    setShowModal(true);
  };

  const handleSave = (company, mode) => {
    if (mode === "add") {
      dispatch({ type: "ADD_COMPANY", payload: company });
    } else if (mode === "edit") {
      dispatch({ type: "UPDATE_COMPANY", payload: company });
    }
  };
  const filteredCompanies = companies
    .filter((company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((company) =>
      selectedProvince === "" ? true : company.province === selectedProvince
    )
    .filter((company) =>
      selectedComSize === "" ? true : company.size === selectedComSize
    );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Companies</h2>

      <button
        className="btn btn-success mb-4"
        onClick={() => {
          setEditingCompany(null);
          setShowModal(true);
        }}
      >
        Add Company
      </button>

      <AddCompanyModal
        showModal={showModal}
        setShowModal={setShowModal}
        mode={editingCompany ? "edit" : "add"}
        editingCompany={editingCompany}
        onSave={handleSave}
      />

      <div className="mb-4">
        <label className="form-label fw-bold me-3">Filter by Province:</label>

        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="province"
            value=""
            checked={selectedProvince === ""}
            onChange={(e) => setSelectedProvince(e.target.value)}
            id="all-provinces"
          />
          <label className="form-check-label" htmlFor="all-provinces">
            All
          </label>
        </div>

        {[...new Set(companies.map((c) => c.province))].map((prov) => (
          <div className="form-check form-check-inline" key={prov}>
            <input
              className="form-check-input"
              type="radio"
              name="province"
              value={prov}
              checked={selectedProvince === prov}
              onChange={(e) => setSelectedProvince(e.target.value)}
              id={`province-${prov}`}
            />
            <label className="form-check-label" htmlFor={`province-${prov}`}>
              {prov}
            </label>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="form-label fw-bold me-3">
          Filter by Company Size:
        </label>

        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="size"
            value=""
            checked={selectedComSize === ""}
            onChange={(e) => setSelectedComSize(e.target.value)}
            id="all-size"
          />
          <label className="form-check-label" htmlFor="all-size">
            All
          </label>
        </div>

        {[...new Set(companies.map((c) => c.size))].map((size) => (
          <div className="form-check form-check-inline" key={size}>
            <input
              className="form-check-input"
              type="radio"
              name="size"
              value={size}
              checked={selectedProvince === size}
              onChange={(e) => setSelectedComSize(e.target.value)}
              id={`size-${size}`}
            />
            <label className="form-check-label" htmlFor={`size-${size}`}>
              {size}
            </label>
          </div>
        ))}
      </div>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search company by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="list-group">
        {filteredCompanies.map((company) => (
          <li
            key={company.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <h5 className="mb-1">{company.name}</h5>
              <h6 className="mb-1">{company.province}</h6>

              <p className="mb-0">Size: {company.size}</p>
            </div>
            <div>
              <button
                className="btn btn-primary me-2"
                onClick={() => handleOnEdit(company)}
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleOnDelete(company.id)}
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

export default Companies;
