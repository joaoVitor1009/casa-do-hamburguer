import { Link } from "react-router";

const home = () => {
  return (
    <div>
      <Link to={"/login"}>Login</Link>
      <Link to={"/register"}>Register</Link>
    </div>
  );
};

export default home;
