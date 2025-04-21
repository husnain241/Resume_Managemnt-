using AutoMapper;
using backend.Core.Context;
using backend.Core.Dtos.Job;
using backend.Core.Entities;
using backend.Core.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobController : ControllerBase
    {
        private ApplicationDbContext _context { get; }
        private IMapper _mapper { get; }

        public JobController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // Create (POST)
        [HttpPost]  
        [Route("Create")]
        public async Task<ActionResult<JobGetDto>> CreateJob(JobCreateDto jobCreateDto)
        {
            var job = new Job
            {
                Title = jobCreateDto.Title,
                Level = jobCreateDto.Level,
                CompanyId = jobCreateDto.CompanyId,
                // Add other fields as necessary
            };

            // Save job to the database
            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            // After saving, load the company information (using Include)
            var savedJob = await _context.Jobs
                                        .Include(j => j.Company)  // Load the associated company
                                        .FirstOrDefaultAsync(j => j.ID == job.ID);

            // Return the saved job with company details
            var jobDto = _mapper.Map<JobGetDto>(savedJob);
            return Ok(jobDto);
        }


        // Read (GET All)
        [HttpGet]
        [Route("Get")]
        public async Task<ActionResult<IEnumerable<JobGetDto>>> GetJobs()
        {
            var jobs = await _context.Jobs.Include(job => job.Company)
                                          .OrderByDescending(q => q.CreatedAt)
                                          .ToListAsync();
            var convertdJobs = _mapper.Map<IEnumerable<JobGetDto>>(jobs);

            return Ok(convertdJobs);    
        }

        // Read (GET Job By ID)
        [HttpGet]
        [Route("Get/{id}")]
        public async Task<ActionResult<JobGetDto>> GetJobById(int id)
        {
            var job = await _context.Jobs.Include(job => job.Company)
                                         .FirstOrDefaultAsync(j => j.ID == id);

            if (job == null)
            {
                return NotFound("Job not found");
            }

            var convertedJob = _mapper.Map<JobGetDto>(job);
            return Ok(convertedJob);
        }


        // Update (PUT)
        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> UpdateJob(long id, [FromBody] JobCreateDto dto)
        {
            var job = await _context.Jobs.FirstOrDefaultAsync(j => j.ID == id);

            if (job == null)
            {
                return NotFound("Job not found");
            }

            // Update the job manually (do NOT use AutoMapper unless you're sure it updates existing object correctly)
            job.Title = dto.Title;
            job.Level = dto.Level;
            job.CompanyId = dto.CompanyId;

            await _context.SaveChangesAsync();

            return Ok(job); // Return updated job
        }


        // Delete (DELETE)
        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteJob(long id)
        {
            var job = await _context.Jobs.FindAsync(id);

            if (job == null)
            {
                return NotFound(new { message = "Job Not Found" });
            }

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Job Deleted Successfully", id = job.ID });
        }




        [HttpGet]
        [Route("levels")]
        public IActionResult GetJobLevels()
        {
            var levels = Enum.GetNames(typeof(JobLevel));
            return Ok(levels);
        }
    }
}
