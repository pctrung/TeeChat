namespace TeeChat.Models.ViewModels
{
    public class UserViewModel
    {
        public string AvatarUrl { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get => LastName + " " + FirstName; }
    }
}