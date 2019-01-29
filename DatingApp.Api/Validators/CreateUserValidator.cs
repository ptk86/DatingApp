using DatingApp.Api.Data;
using DatingApp.Api.Dto;
using FluentValidation;

namespace DatingApp.Api.Validators
{
    public class CreateUserValidator : AbstractValidator<UserCreate>
    {
        private readonly IAuthRepository _authRepository;

        public CreateUserValidator(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
            RuleFor(cu => cu.UserName)
                .NotEmpty();
            RuleFor(cu => cu.UserName)
                .Must(userName => { return !_authRepository.UserNameExists(userName); })
                .WithMessage("User already exists!");
            RuleFor(cu => cu.Gender)
                .NotEmpty();
            RuleFor(cu => cu.DateOfBirth)
                .NotEmpty();
            RuleFor(cu => cu.KnownAs)
                .NotEmpty();
            RuleFor(cu => cu.City)
                .NotEmpty();
            RuleFor(cu => cu.Country)
                .NotEmpty();
            RuleFor(cu => cu.Password)
                .NotEmpty()
                .MinimumLength(4)
                .MaximumLength(8);
        }
    }
}