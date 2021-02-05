using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SimpleChat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleChat.Controllers
{
    [Route("api/chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ChatHub chatHub;
        public ChatController(ChatHub chatHub)
        {
            this.chatHub = chatHub;
        }

        [HttpPost("message")]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessage message)
        {
            await chatHub.SendMessage(message.Nick, message.Color, message.Message);

            return Ok();
        }
    }
}
