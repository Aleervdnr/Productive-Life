import { useAuth } from "../context/AuthContext";
import { BurgerMenu, CrossMenu } from "./BurgerCrossMenu";
import logo from "../assets/logo.png";
import { AvatarIcon, AvatarIconSkeleton } from "./AvatarIcon";
import ItemNavBar from "./ItemNavBar";
import { useState } from "react";
import { Link } from "react-router-dom";

//import icons
import { FaHome } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { FaArrowRightFromBracket } from "react-icons/fa6";

function NavBar({ activeItem }) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  const handleMenuOpenClose = () => {
    setMenuIsOpen(!menuIsOpen);
  };
  return (
    <div className={`p-5 lg:p-0 lg:w-[250px] row-start-1 ${!isAuthenticated && `hidden`}`}>
      <BurgerMenu setMenu={handleMenuOpenClose} />
      <nav
        className={`w-full p-5 h-screen absolute top-0 left-0 bg-dark-400  transition-transform duration-300 ease-in-out max-lg:max-w-[375px] lg:static lg:translate-x-0  lg:px-0  ${
          menuIsOpen ? `translate-x-0` : `translate-x-[-100%]`
        }`}
      >
        <CrossMenu setMenu={handleMenuOpenClose} />
        <ul className="w-full grid justify-items-center">
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
            <FaHome className="text-xl" />
            <span>Inicio</span>
          </ItemNavBar>
          <ItemNavBar name={"tasks"} activeItem={activeItem}>
            <FaTasks className="text-xl" />
            <span>Tareas</span>
          </ItemNavBar>
          <ItemNavBar name={"gastos"} activeItem={activeItem}>
            <FaWallet className="text-xl" />
            <span>Gastos</span>
          </ItemNavBar>
          <ItemNavBar name={"compras"} activeItem={activeItem}>
            <FaCartShopping className="text-xl" />
            <span>Compras</span>
          </ItemNavBar>
        </ul>
        <ul>
          <ItemNavBar name={"logout"} activeItem={activeItem}>
            <FaArrowRightFromBracket className="text-xl" />
            <span>Cerrar sesion</span>
          </ItemNavBar>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
