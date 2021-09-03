namespace TeeChat.Application.Identity
{
    public interface ICurrentUser
    {
        string UserName { get; }

        string UserId { get; }
    }
}