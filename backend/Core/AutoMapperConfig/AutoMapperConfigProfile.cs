    using AutoMapper;
    using backend.Core.Dtos.Candidate;
    using backend.Core.Dtos.Company;
    using backend.Core.Dtos.Job;
    using backend.Core.Entities;

    namespace backend.Core.AutoMapperConfig
    {
        public class AutoMapperConfigProfile : Profile
        {
            public AutoMapperConfigProfile()
            {
                // Company
                // Company
                CreateMap<CompanyCreateDto, Company>()
                    .ForMember(dest => dest.ID, opt => opt.Ignore())
                    .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());
                CreateMap<Company, CompanyGetDto>();


                // Job
                CreateMap<JobCreateDto, Job>()
                    .ForMember(dest => dest.ID, opt => opt.Ignore())          // Ignore Id (not to be updated)
                    .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());  // Ignore CreatedAt (not to be updated)

                CreateMap<Job, JobGetDto>()
                    .ForMember(dest => dest.CompanyName, opt => opt.MapFrom(src => src.Company.Name));

                // Candidate
                CreateMap<CandidateCreateDto, Candidate>()
                    .ForMember(dest => dest.ID, opt => opt.Ignore())
                    .ForMember(dest => dest.ResumeUrl, opt => opt.Ignore());
                CreateMap<Candidate, CandidateGetDto>()
                    .ForMember(dest => dest.JobTitle, opt => opt.MapFrom(src => src.Job.Title));

            }
        }
    }
