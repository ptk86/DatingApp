using System;

namespace DatingApp.Api.Dto
{
    public class MessageCreate
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public DateTime MessageSent { get; set; }
        public string Content { get; set; }

        public MessageCreate()
        {
            MessageSent = DateTime.UtcNow;
        }
    }
}