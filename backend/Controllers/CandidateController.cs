using AutoMapper;
using backend.Core.Context;
using backend.Core.Dtos.Candidate;
using backend.Core.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CandidateController : ControllerBase
    {
        private ApplicationDbContext _context { get; }
        private IMapper _mapper { get; }

        public CandidateController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // CRUD 

        // Create
            [HttpPost]
            [Route("Create")]
            public async Task<IActionResult> CreateCandidate([FromForm] CandidateCreateDto dto, IFormFile pdfFile)
            {
                var maxFileSize = 5 * 1024 * 1024; // 5 MB

                if (pdfFile == null || pdfFile.Length == 0)
                    return BadRequest("CV file is required.");

                var allowedMimeTypes = new[]
                {
            "application/pdf"
        };

                if (pdfFile.Length > maxFileSize || !allowedMimeTypes.Contains(pdfFile.ContentType))
                {
                    return BadRequest("Invalid file type or size exceeded (max 5MB).");
                }

                // Ensure wwwroot/uploads directory exists
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Generate unique filename
                var extension = Path.GetExtension(pdfFile.FileName); // use original extension
                var fileName = Guid.NewGuid().ToString() + extension;
                var filePath = Path.Combine(uploadsFolder, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await pdfFile.CopyToAsync(stream);
                }

                // Map DTO and assign the file URL
                var newCandidate = _mapper.Map<Candidate>(dto);
                newCandidate.ResumeUrl = $"/uploads/{fileName}";

                await _context.Candidates.AddAsync(newCandidate);
                await _context.SaveChangesAsync();

                return Ok("Candidate created successfully.");
            }

        // Read (Get All Candidates)
        [HttpGet]
        [Route("Get")]
        public async Task<ActionResult<IEnumerable<CandidateGetDto>>> GetCandidates()
        {
            try
            {
                var candidates = await _context.Candidates
                                               .Include(c => c.Job)
                                               .OrderByDescending(q => q.CreatedAt)
                                               .ToListAsync();

                var convertedCandidates = _mapper.Map<IEnumerable<CandidateGetDto>>(candidates);

                return Ok(convertedCandidates);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in GetCandidates: " + ex.Message);
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }


        // Read (Get Candidate By ID)
        [HttpGet]
        [Route("Get/{id}")]
        public async Task<ActionResult<CandidateGetDto>> GetCandidateById(long id)
        {
            var candidate = await _context.Candidates
                                          .Include(candidate => candidate.Job)
                                          .FirstOrDefaultAsync(j => j.ID == id);

            if (candidate == null)
            {
                return NotFound("Candidate Not Found");
            }

            var convertedCandidate = _mapper.Map<CandidateGetDto>(candidate);
            return Ok(convertedCandidate);
        }

        // Read (Download Pdf File)
        [HttpGet]
        [Route("Download/{url}")]
        public IActionResult DownloadPdfFile(string url)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "documents", "pdfs", url);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("File Not Found");
            }

            var pdfBytes = System.IO.File.ReadAllBytes(filePath);
            var file = File(pdfBytes, "application/pdf", url);
            return file;
        }

        // Update
        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> UpdateCandidate(long id, [FromForm] CandidateCreateDto dto, IFormFile? pdfFile)
        {
            var existingCandidate = await _context.Candidates.FindAsync(id);
            if (existingCandidate == null)
            {
                return NotFound("Candidate Not Found");
            }

            _mapper.Map(dto, existingCandidate);

            if (pdfFile != null)
            {
                var fiveMegaByte = 5 * 1024 * 1024;
                var pdfMimeType = "application/pdf";

                if (pdfFile.Length > fiveMegaByte || pdfFile.ContentType != pdfMimeType)
                {
                    return BadRequest("File is not valid");
                }

                var resumeUrl = Guid.NewGuid().ToString() + ".pdf";
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "documents", "pdfs", resumeUrl);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await pdfFile.CopyToAsync(stream);
                }

                // Delete old file
                var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "documents", "pdfs", existingCandidate.ResumeUrl);
                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }

                existingCandidate.ResumeUrl = resumeUrl;
            }

            _context.Candidates.Update(existingCandidate);
            await _context.SaveChangesAsync();

            return Ok("Candidate Updated Successfully");
        }

        // Delete
        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteCandidate(long id)
        {
            var candidate = await _context.Candidates.FindAsync(id);
            if (candidate == null)
            {
                return NotFound("Candidate Not Found");
            }

            // Delete resume file
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "documents", "pdfs", candidate.ResumeUrl);
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);            
            }

            _context.Candidates.Remove(candidate);
            await _context.SaveChangesAsync();

            return Ok("Candidate Deleted Successfully");
        }
    }
}
