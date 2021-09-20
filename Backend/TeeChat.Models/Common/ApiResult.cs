namespace TeeChat.Models.Common
{
    public class ApiResult<T>
    {
        public int StatusCode { get; set; }

        public string Message { get; set; }

        public T Data { get; set; }

        public ApiResult(T resultData)
        {
            Data = resultData;
        }
        public static ApiResult<T> Ok(T result, string message = "Action successfully") => new(result) { StatusCode = 200, Message = message };

        public static ApiResult<T> Created(T result, string message = "Created") => new(result) { StatusCode = 201, Message = message };

        public static ApiResult<T> BadRequest(T result, string message = "Something went wrong") => new(result) { StatusCode = 400, Message = message };

        public static ApiResult<T> ForBid(T result, string message = "You do not have permission to access this resource") => new(result) { StatusCode = 403, Message = message };

        public static ApiResult<T> NotFound(T result, string message = "Not found resources") => new(result) { StatusCode = 404, Message = message };
    }
}