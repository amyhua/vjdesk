import path from "path";

const addTrailingSlash = (url?: string) => {
  if (!url) return;
  return url.endsWith("/") ? url : url + "/";
}

export const apiUrl = process.env.API_URL ? addTrailingSlash(process.env.API_URL) : "http://localhost:3000/";
export const categoriesApiUrl = addTrailingSlash(apiUrl) + 'api/categories';
export const clipsApiUrl = addTrailingSlash(apiUrl) + 'api/clips';
