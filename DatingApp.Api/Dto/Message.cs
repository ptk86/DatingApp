using System;

namespace DatingApp.Api.Dto
{
    public class Message
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public DateTime MessageSent { get; set; }
        public string Content { get; set; }

        public Message()
        {
            MessageSent = DateTime.UtcNow;
        }
    }
}