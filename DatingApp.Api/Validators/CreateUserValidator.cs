using DatingApp.Api.Data;
using DatingApp.Api.Dto;
using FluentValidation;

namespace DatingApp.Api.Validators
{
    public class CreateUserValidator : AbstractValidator<CreateUser>
    {
        private readonly IAuthRepository _authRepository;

        public CreateUserValidator(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
            RuleFor(cu => cu.UserName).NotEmpty();
            RuleFor(cu => cu.UserName).Must(userName => {
                return !_authRepository.UserNameExists(userName);
            }).WithMessage("User already exists!");

            RuleFor(cu => cu.Password).NotEmpty().MinimumLength(4).MaximumLength(8);
        }   
    }
}