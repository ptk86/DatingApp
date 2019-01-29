using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.Api.Dto
{
    public class PhotoCreate
    {
        public PhotoCreate()
        {
            DateAdded = DateTime.UtcNow;    
        }

        public int Id { get; set; }
        public string Url { get; set; }
        public IFormFile File { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public bool PublicId { get; set; }
    }
}
