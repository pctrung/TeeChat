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
    }
}