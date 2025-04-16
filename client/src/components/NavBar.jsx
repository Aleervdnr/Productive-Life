import { useAuth } from "../context/AuthContext";
import { BurgerMenu, CrossMenu } from "./BurgerCrossMenu";
import logo from "../assets/Logo.png";
import { AvatarIcon, AvatarIconSkeleton } from "./AvatarIcon";
import ItemNavBar from "./ItemNavBar";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "../hooks/UseTranslation";
import { useLanguage } from "../context/LanguageContext";

//import icons
import { FaHome } from "react-icons/fa";
import { FaTasks } from "react-icons/fa";
import { FaWallet } from "react-icons/fa";
import { GrTest } from "react-icons/gr";
import { FaCartShopping } from "react-icons/fa6";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { MdLanguage } from "react-icons/md";
import { GrUserAdmin } from "react-icons/gr";

function NavBar({ activeItem }) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const { isAuthenticated, logout, user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  const handleLogout = () => {
    logout();
    setMenuIsOpen(false);
    navigate("/");
  };

  const handleMenuOpenClose = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  // Handle clicking outside to close dropdown
  const detailsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        detailsRef.current.removeAttribute("open");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle clicking outside to close Menu
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuIsOpen
      ) {
        setMenuIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 p-5 lg:p-0 lg:w-52 z-[900] ${
        !isAuthenticated && `hidden`
      } ${loading && `hidden`}`}
    >
      <BurgerMenu setMenu={handleMenuOpenClose} />
      <nav
        className={`max-lg:w-[60vw] p-5 h-dvh absolute top-0 left-0 bg-dark-400  transition-transform duration-300 ease-in-out max-lg:max-w-[375px] lg:static lg:translate-x-0  lg:px-0  ${
          menuIsOpen ? `translate-x-0` : `translate-x-[-100%]`
        } grid lg:pb-8`}
        ref={menuRef}
      >
        <div>
          <CrossMenu setMenu={handleMenuOpenClose} />
          <ul className="w-full grid justify-items-center mb-10">
            <Link to={"/home"} className="hidden lg:block">
              <img
                src={logo}
                alt="logo productive life"
                className="max-w-[150px] "
              />
            </Link>
            <li className="grid justify-items-center my-4 capitalize">
              {user ? <AvatarIcon name={user.name} /> : <AvatarIconSkeleton />}
            </li>
            {/* <ItemNavBar name={"home"} activeItem={activeItem} handleCloseMenu={handleMenuOpenClose} >
              <FaHome className="text-[18px]" />
              <span>Inicio</span>
            </ItemNavBar> */}
            <ItemNavBar
              name={"tasks"}
              activeItem={activeItem}
              handleCloseMenu={handleMenuOpenClose}
            >
              <FaTasks className="text-[18px]" />
              <span>{t("nav.navSections.tasks")}</span>
            </ItemNavBar>
            <ItemNavBar
              name={"gastos"}
              activeItem={activeItem}
              handleCloseMenu={handleMenuOpenClose}
            >
              <FaWallet className="text-[18px]" />
              <span>{t("nav.navSections.expenses")}</span>
            </ItemNavBar>
            {user?.role == "tester" && (
              <ItemNavBar
                name={"tester-feedback"}
                activeItem={activeItem}
                handleCloseMenu={handleMenuOpenClose}
              >
                <GrTest className="text-[18px]" />
                <span>Testers</span>
              </ItemNavBar>
            )}
            {user?.role == "admin" && (
              <ItemNavBar
                name={"admin-page"}
                activeItem={activeItem}
                handleCloseMenu={handleMenuOpenClose}
              >
                <GrUserAdmin className="text-[18px]" />
                <span>Admin</span>
              </ItemNavBar>
            )}
            {/* <ItemNavBar name={"compras"} activeItem={activeItem} handleCloseMenu={handleMenuOpenClose}>
              <FaCartShopping className="text-[18px]" />
              <span>Compras</span>
            </ItemNavBar> */}
          </ul>
        </div>
        <ul className="w-full grid justify-center place-items-center">
          <details className="dropdown" ref={detailsRef}>
            <summary className="btn bg-dark-500 border-none py-2 px-4 min-h-9 h-9">
              <MdLanguage />
              Lang
            </summary>
            <ul className="menu dropdown-content bg-dark-500 rounded-box z-1 w-52 p-2 shadow-sm z-50">
              <li>
                <a onClick={() => changeLanguage("en")}>English</a>
              </li>
              <li>
                <a onClick={() => changeLanguage("es")}>Spanish</a>
              </li>
            </ul>
          </details>{" "}
          <li
            className="cursor-pointer bg-dark-500 rounded-lg w-fit h-fit"
            onClick={handleLogout}
          >
            <span
              className={` capitalize relative flex gap-4  px-4 py-2 items-center  max-lg:rounded-lg lg:rounded-r-lg text-dark-100 font-semibold max-lg:before:hidden lg:text-sm`}
            >
              <FaArrowRightFromBracket className="text-sm" />
              {t("nav.logoutButton")}
            </span>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
