import { Link } from "react-router";

const Header = () => {
  return (
    <div className="items-center bg-[#161410]">
      <div className="mx-auto flex w-full items-center justify-between p-3 md:w-184.25 md:p-0">
        <img src="./public/logo.png" alt="" />
        <Link to={"/login"}>
          <div className="flex h-8.75 w-32.5 cursor-pointer items-center justify-center rounded-sm bg-[#F2DAAC]">
            Entrar
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Header;
