using System.Collections.Generic;

namespace TeeChat.Models.ResponseModels.Common
{
    public abstract class HubResponseBase
    {
        public List<string> RecipientUserNames { get; set; }
    }
}