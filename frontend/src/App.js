// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Import Navbar component
import Home from "./pages/Home";
import Candidates from "./pages/Candidates";
import Companies from "./pages/Companies";
import Jobs from "./pages/Jobs";
import Footer from "./components/Footer";
import AddCandidateModal from "./pages/Models/AddCandidateModal";
import './App.css';

const App = () => {
  return (
    <div>
      <Navbar /> {/* Include Navbar */}
      <div className="container mt-4">
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/candidates" element={<Candidates />} />
  <Route path="/candidate" element={<AddCandidateModal />} />        
<Route path="/candidate/:id" element={<AddCandidateModal />} />   
  <Route path="/companies" element={<Companies />} />
  <Route path="/jobs" element={<Jobs />} />
</Routes>

      </div>
      <Footer /> {/* Include Footer */}
    </div>
  );
};

export default App;
