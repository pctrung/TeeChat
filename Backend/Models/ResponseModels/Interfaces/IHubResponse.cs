using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeeChat.Models.ResponseModels.Interfaces
{
    public abstract class HubResponseBase
    {
        public List<string> ParticipantUserNamesToNotify { get; set; }
    }
}