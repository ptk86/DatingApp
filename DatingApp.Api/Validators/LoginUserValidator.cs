using DatingApp.Api.Dto;
using FluentValidation;

namespace DatingApp.Api.Validators
{
    public class LoginUserValidator : AbstractValidator<LoginUser>
    {
        public LoginUserValidator()
        {
            RuleFor(cu => cu.UserName).NotEmpty();
            RuleFor(cu => cu.Password).NotEmpty();
        }   
    }
}