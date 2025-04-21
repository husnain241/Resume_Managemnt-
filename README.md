# Resume Management System

This is a full-stack **Resume Management System** built using:
- **Frontend**: React + React Router + Bootstrap 5
- **Backend**: ASP.NET Core Web API
- **Database**: Entity Framework Core (SQL Server)
- **File Upload**: Supports uploading CV files (PDF, DOC, DOCX) to the server

---

## Features

### Frontend
- Responsive navigation bar with toggle and icon switch (hamburger / close)
- Pages:
  - Home
  - Companies (listing companies)
  - Jobs (listing and managing job roles)
  - Candidates (CRUD for candidates)
- Form for creating/updating candidates
  - Upload CV
  - Job selection dropdown
  - Cover letter support
  - Validation and alerts

### Backend
- ASP.NET Core Web API with Entity Framework Core
- Controllers:
  - `CandidateController`
- DTOs:
  - `CandidateCreateDto`
  - `CandidateGetDto`
- AutoMapper for DTO <-> Entity mapping
- Resume files stored in `wwwroot/uploads` folder
- Validation for:
  - File size (Max 5MB)
  - Allowed mime types (`application/pdf`, `application/msword`, etc)

---

## Candidate API Endpoints

### Create Candidate
`POST /api/Candidate/Create`
- Accepts `multipart/form-data`
- Required fields:
  - `firstName`
  - `lastName`
  - `email`
  - `phone`
  - `coverLetter`
  - `jobId`
  - `pdfFile`

### Get All Candidates
`GET /api/Candidate/Get`

### Get Candidate by ID
`GET /api/Candidate/Get/{id}`

### Update Candidate
`PUT /api/Candidate/Update/{id}`
- Accepts `multipart/form-data`
- Same fields as Create

### Delete Candidate
`DELETE /api/Candidate/Delete/{id}`

---

## Backend Technologies
- ASP.NET Core 7
- Entity Framework Core
- AutoMapper
- SQL Server

### File Upload Logic
- Save to: `wwwroot/uploads/{Guid}.{extension}`
- Resume file path is saved in `ResumeUrl` column


## Setup Instructions

### Backend
1. Clone the repo and navigate to backend folder
2. Setup your SQL Server connection string in `appsettings.json`
3. Run migrations:
```bash
dotnet ef migrations add Init
```
```bash
dotnet ef database update
```
4. Run the backend:
```bash
dotnet run
```

### Frontend
1. Navigate to frontend folder
2. Install dependencies:
```bash
npm install
```
3. Start development server:
```bash
npm start
```

---

## Developer Notes
- Used `FormData` for candidate creation and update to handle file upload
- Used `NavLink` for active route highlighting
- CSS for active route is managed in `App.css`
- FontAwesome icons are used for the responsive navbar toggle

---

## Author
**ALI HUSNAIN** – Resume Management System – April 2025

