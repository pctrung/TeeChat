import { useEffect, useState } from "react";
import useChatApi from "./useChatApi";

export default function useMessagePagination(currentChat, page) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appendChat, setAppendChat] = useState({});
  const [hasMore, setHasMore] = useState(false);

  const chatApi = useChatApi();

  useEffect(() => {
    if (page > 1 && hasMore) {
      setLoading(true);
      setError(false);

      const request = { page };
      chatApi
        .getById(currentChat.id, request)
        .then((response) => {
          setAppendChat(response);
          setHasMore(page < response.pageCount);
          setLoading(false);
        })
        .catch((e) => {
          setError(e);
        });
    }
  }, [page]);

  useEffect(() => {
    setHasMore(page < currentChat?.pageCount);
  }, [currentChat]);

  return { loading, error, appendChat, hasMore };
}
