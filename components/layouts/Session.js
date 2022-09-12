import SessionTopbar from "./reusable/SessionTopbar";
import styles from "./Session.module.css";
import useCurrentUser from "@/lib/hook/useCurrentUser";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "@/lib/store/session";

export default function Session({ children }) {
  const { token, currentUser } = useCurrentUser();
  const dispatch = useDispatch();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    dispatch(setToken(jwt));
  }, []);
  return (
    <div>
      <SessionTopbar />
      <div className={styles.container}>{children}</div>
    </div>
  );
}
