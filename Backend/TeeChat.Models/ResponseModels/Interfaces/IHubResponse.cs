using System.Collections.Generic;

namespace TeeChat.Models.ResponseModels.Interfaces
{
    public abstract class HubResponseBase
    {
        public List<string> ParticipantUserNamesToNotify { get; set; }
    }
}