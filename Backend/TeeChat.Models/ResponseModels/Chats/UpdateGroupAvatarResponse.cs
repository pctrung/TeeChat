using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TeeChat.Models.ResponseModels.Interfaces;

namespace TeeChat.Models.ResponseModels.Chats
{
    public class UpdateGroupAvatarResponse : HubResponseBase
    {
        public string GroupAvatarUrl { get; set; }
        public int ChatId { get; set; }
    }
}