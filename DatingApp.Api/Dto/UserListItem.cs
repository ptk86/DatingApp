using System;
using System.Collections.Generic;
using DatingApp.Api.Models;

namespace DatingApp.Api.Dto
{
    public class UserListItem
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Gender { get; set; }
        public int Age { get; set; }
        public string KnownAs { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string PhotoUrl { get; set; }
    }
}