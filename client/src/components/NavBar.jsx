import { useAuth } from "../context/AuthContext";
import { BurgerMenu, CrossMenu } from "./BurgerCrossMenu";
import logo from "../assets/logo.png";
import { AvatarIcon, AvatarIconSkeleton } from "./AvatarIcon";
import ItemNavBar from "./ItemNavBar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//import icons
import { FaHome } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { FaArrowRightFromBracket } from "react-icons/fa6";

function NavBar({ activeItem }) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate()


  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleMenuOpenClose = () => {
    setMenuIsOpen(!menuIsOpen);
  };
  return (
    <div className={`p-5 lg:p-0 lg:w-[220px] row-start-1 ${!isAuthenticated && `hidden`}`}>
      <BurgerMenu setMenu={handleMenuOpenClose} />
      <nav
        className={`w-full p-5 h-dvh absolute top-0 left-0 bg-dark-400  transition-transform duration-300 ease-in-out max-lg:max-w-[375px] lg:static lg:translate-x-0  lg:px-0  ${
          menuIsOpen ? `translate-x-0` : `translate-x-[-100%]`
        } grid content-start lg:pb-6`}
      >
        <CrossMenu setMenu={handleMenuOpenClose} />
        <ul className="w-full grid justify-items-center mb-10">
          <Link to={"/home"} className="hidden lg:block">
            <img
              src={logo}
              alt="logo productive life"
              className="max-w-[150px] "
            />
          </Link>
          <li className="grid justify-items-center my-4">
            {user ? <AvatarIcon name={user.name} /> : <AvatarIconSkeleton />}
          </li>
          <ItemNavBar name={"home"} activeItem={activeItem}>
            <FaHome className="text-[18px]" />
            <span>Inicio</span>
          </ItemNavBar>
          <ItemNavBar name={"tasks"} activeItem={activeItem}>
            <FaTasks className="text-[18px]" />
            <span>Tareas</span>
          </ItemNavBar>
          <ItemNavBar name={"gastos"} activeItem={activeItem}>
            <FaWallet className="text-[18px]" />
            <span>Gastos</span>
          </ItemNavBar>
          <ItemNavBar name={"compras"} activeItem={activeItem}>
            <FaCartShopping className="text-[18px]" />
            <span>Compras</span>
          </ItemNavBar>
        </ul>
        <ul className="w-full flex justify-center ">
          <li className="cursor-pointer bg-dark-500 rounded-lg w-fit" onClick={handleLogout}>
            <span
              className={` capitalize relative flex gap-4  px-4 py-2 items-center  max-lg:rounded-lg lg:rounded-r-lg text-dark-100 font-semibold max-lg:before:hidden lg:text-sm`}
            >
              <FaArrowRightFromBracket className="text-sm" />
              Cerrar sesion
            </span>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
