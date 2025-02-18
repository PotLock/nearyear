import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { NearContext } from "@/wallets/near";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { signedAccountId, wallet } = useContext(NearContext);
  const [action, setAction] = useState(() => {});
  const [label, setLabel] = useState("Loading...");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!wallet) return;

    if (signedAccountId) {
      setAction(() => wallet.signOut);
      setLabel(`Sign out ${signedAccountId}`);
    } else {
      setAction(() => wallet.signIn);
      setLabel("Login");
    }
  }, [signedAccountId, wallet]);

  // Ensure menuOpen is only set after the component mounts
  useEffect(() => {
    setMenuOpen(false); // or any default state you want
  }, []);

  return (
    <nav className="sticky top-0 bg-white text-gray-800 p-6 shadow-md z-50">
      <div className="flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center no-underline whitespace-nowrap relative"
        >
          <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">
            🏆
          </span>
          <span className="ml-2 font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500 relative group">
            NEAR YEAR
            <span className="absolute left-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-300 w-0 group-hover:w-full"></span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-5 flex-grow justify-center">
          {[
            "/winners",
            "https://shard.dog/nearyear",
            "/nomination",
            "/register",
          ].map((path, index) => {
            const isActive = router.pathname === path;
            const linkText =
              path === "/winners"
                ? "Winners"
                : path === "https://shard.dog/nearyear"
                ? "Voter NFT"
                : path === "/nomination"
                ? "Nominate"
                : "Create Project";
            return (
              <Link
                key={index}
                href={path}
                className={`relative text-gray-800 font-bold no-underline transition duration-200 ${
                  isActive ? "text-blue-500" : "hover:text-blue-500"
                }`}
              >
                {linkText}
                <span
                  className={`absolute left-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-300 ${
                    isActive ? "w-full" : "w-0"
                  } transform ${isActive ? "" : "group-hover:w-full"}`}
                  style={{
                    marginTop: "4px",
                    transition: "width 0.3s ease, left 0.3s ease",
                  }}
                ></span>
              </Link>
            );
          })}
        </div>
        <div className="hidden md:block">
          <button
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded cursor-pointer transition duration-200 hover:shadow-lg"
            onClick={action}
          >
            {label}
          </button>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <FaTimes className="w-6 h-6 text-gray-600" />
          ) : (
            <FaBars className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          menuOpen
            ? "max-h-[400px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col items-stretch gap-2 mt-4 pt-4 border-t border-gray-200">
          {[
            "/winners",
            "https://shard.dog/nearyear",
            "/nomination",
            "/register",
          ].map((path, index) => {
            const isActive = router.pathname === path;
            const linkText =
              path === "/winners"
                ? "Winners"
                : path === "https://shard.dog/nearyear"
                ? "Voter NFT"
                : path === "/nomination"
                ? "Nominate"
                : "Create Project";

            return (
              <Link
                key={index}
                href={path}
                target={path.startsWith("http") ? "_blank" : undefined}
                className={`text-gray-800 font-medium px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {linkText}
              </Link>
            );
          })}
          <button
            onClick={action}
            className="mt-2 w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-3 rounded-lg font-medium transition duration-200 hover:shadow-lg"
          >
            {label}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
