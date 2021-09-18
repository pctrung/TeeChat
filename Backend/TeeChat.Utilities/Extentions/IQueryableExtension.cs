using System.Linq;

namespace TeeChat.Utilities.Extentions
{
    public static class IQueryableExtensions
    {
        public static IQueryable<T> Paged<T>(this IQueryable<T> source, int page, int limit)
        {
            page = page < 0 ? 1 : page;
            return source.Skip((page - 1) * limit).Take(limit);
        }
    }
}