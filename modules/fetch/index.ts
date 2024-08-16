import fetch from 'cross-fetch';

const fetchJson = async (method: 'GET' | 'POST', url: string, options: any = {}) => {
  const resp = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {})
    },
    ...options
  });
  if (resp.status !== 200) return null;
  return resp.json();
};

export {
  fetchJson
};
