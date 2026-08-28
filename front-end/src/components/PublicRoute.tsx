import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const [isCheking, setIsCheking] = useState(false);
  const navigate = useNavigate();
  const cookie = document.cookie;

  useEffect(() => {
    if (cookie) {
      const cookies = cookie.split("; ");
      const userCookie = cookies.find((a) => a.startsWith("user="));

      if (userCookie) {
        navigate("/", { replace: true });
        return;
      }
    }
    setIsCheking(true);
  }, [navigate]);

  if (isCheking === true) {
    return <div>{children}</div>;
  }
};

export default PublicRoute;
