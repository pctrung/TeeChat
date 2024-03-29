﻿using TeeChat.Models.ResponseModels.Common;

namespace TeeChat.Models.ResponseModels.Chats
{
    public class UpdateGroupAvatarResponse : HubResponseBase
    {
        public string GroupAvatarUrl { get; set; }
        public int ChatId { get; set; }
    }
}