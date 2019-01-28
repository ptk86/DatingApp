﻿using System;

namespace DatingApp.Api.Dto {
    public class PhotoForUserDetail
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public string PublicId { get; set; }
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }
    }
}