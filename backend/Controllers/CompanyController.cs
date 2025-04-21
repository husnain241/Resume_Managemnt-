using AutoMapper;
using backend.Core.Context;
using backend.Core.Dtos.Company;
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
    public class CompanyController : ControllerBase
    {   
        private ApplicationDbContext _context { get; }
        private IMapper _mapper { get; }

        public CompanyController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // CRUD 

            // Create
            [HttpPost]
            [Route("Create")]
            public async Task<IActionResult> CreateCompany([FromBody] CompanyCreateDto dto)
            {
                Company newCompany = _mapper.Map<Company>(dto);
                await _context.Companies.AddAsync(newCompany);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Company Created Successfully", id = newCompany.ID });
                }

        // Read (Get All Companies)
        [HttpGet]
        [Route("Get")]
            public async Task<ActionResult<IEnumerable<CompanyGetDto>>> GetCompanies()
            {
                var companies = await _context.Companies
                                              .Include(company => company.Jobs)   // Include related jobs
                                              .OrderByDescending(q => q.CreatedAt)
                                              .ToListAsync();

                var convertedCompanies = _mapper.Map<IEnumerable<CompanyGetDto>>(companies);

                return Ok(convertedCompanies);
            }

        // Read (Get Company By ID)
        [HttpGet]
        [Route("Get/{id}")]
        public async Task<ActionResult<CompanyGetDto>> GetCompanyById(int id)
        {
            var company = await _context.Companies
                                        .Include(company => company.Jobs)   // Include related jobs
                                        .FirstOrDefaultAsync(c => c.ID == id);

            if (company == null)
            {
                return NotFound("Company Not Found");
            }

            var convertedCompany = _mapper.Map<CompanyGetDto>(company);
            return Ok(convertedCompany);
        }

        // Update
        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> UpdateCompany(long id, [FromBody] CompanyCreateDto dto)
        {
            var existingCompany = await _context.Companies.FindAsync(id);
            if (existingCompany == null)
            {
                return NotFound("Company Not Found");
            }

            _mapper.Map(dto, existingCompany);
            _context.Companies.Update(existingCompany);
            await _context.SaveChangesAsync();

            return Ok("Company Updated Successfully");
        }

        // Delete
        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteCompany(long id)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null)
            {
                return NotFound(new { message = "Company Not Found" });
            }

            _context.Companies.Remove(company);
            await _context.SaveChangesAsync();

       
            return Ok(new { message = "Company Deleted Successfully", id = company.ID });
        }



        [HttpGet]
        [Route("sizes")]
        public IActionResult GetCompanySizes()
        {
            var sizes = Enum.GetNames(typeof(CompanySize));
            return Ok(sizes);
        }

        [HttpGet]
        [Route("provinces")]
        public IActionResult GetCompanyProvinces()
        {
            var cites = Enum.GetNames(typeof(CompanyProvince));
            return Ok(cites);
        }

    }
}
