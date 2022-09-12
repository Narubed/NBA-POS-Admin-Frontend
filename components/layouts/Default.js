import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "@/lib/store/session";

export default function Default({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    dispatch(setToken(jwt));
  }, []);

  return <div>{children}</div>;
}
