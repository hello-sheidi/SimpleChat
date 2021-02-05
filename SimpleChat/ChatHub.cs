using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleChat
{
    public class ChatHub : Hub
    {
        int notUsedColorIndex = 0;

        List<string> userColors = new List<string>()
        {
            "#8bc34a",
            "#f50057",
            "#03a9f4",
            "#f44336",
            "#ffea00"
        };

        public override async Task OnConnectedAsync()
        {
            if(notUsedColorIndex < 4)
            {
                notUsedColorIndex++;
            }
            else
            {
                notUsedColorIndex = 0;
            }

            await AssignColor(userColors.ElementAt(notUsedColorIndex), Context.ConnectionId);

            await base.OnConnectedAsync();
        }

        public async Task AssignColor(string color, string connectionId)
        {
            await Clients.Client(connectionId).SendAsync("ColorAssigned", color);
        }

        public async Task SendMessage(string user, string color, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message, color);
        }
    }
}
