import { useState } from "react";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = async ({
  url,
  method = "GET",
  body = null,
  headers = {
    "Content-Type": "application/json",
  },
}) => {
    try {
  setLoading(true);
  setError(null);

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  const data = await response.json();

  return data;
} catch (err) {
  setError(err.message);
  throw err;
} finally {
  setLoading(false);
}

};
  return {
    loading,
    error,
    sendRequest,
  };
};

export default useApi;