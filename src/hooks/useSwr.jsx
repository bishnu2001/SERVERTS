// import { BASE_URL, getFromLocalStorage } from "@/utils";
import useSWR, { SWRConfiguration } from "swr";
import { BASE_URL } from "../DATA/category";

const getFromLocalStorage = (key) => {
  return localStorage.getItem(key);
};

export const getAccessToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const token = getFromLocalStorage("token");
  return typeof token === "string" ? token : null;
};

const useSwr = (url, options) => {
  const accessToken = getFromLocalStorage("token");
  const fetcher = async (url) => {
    const headers = {};
    accessToken && (headers["Authorization"] = `Bearer ${accessToken}`);
    headers["Content-Type"] = "application/json";
    const res = await fetch(url, {
      method: "GET",
      headers,
    });
    const data = await res.json();

    return { data, res };
  };
  const { data, error, mutate, isValidating } = useSWR(
    url ? [`${BASE_URL}/${url}`] : null,
    fetcher,
    {
      ...options,
      revalidateOnFocus: false,
    }
  );
  return {
    data,
    error,
    isValidating,
    mutate,
  };
};
export default useSwr;

// import { useSwr } from "@/hooks";

// const { data: userCountBox, isValidating: userCountValidating } =
//   useSwr(`admin/users/card`);

// get
// const { data, isValidating, mutate } = useSwr(`post/get`);
