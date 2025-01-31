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
          className={`flex items-center no-underline whitespace-nowrap relative`}
        >
          <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">
            🏆
          </span>
          <span className="ml-2 font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500 relative group">
            NEAR YEAR
            <span
              className="absolute left-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-300 w-0 group-hover:w-full"
              style={{ marginTop: "4px" }}
            ></span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-5 flex-grow justify-center">
          {[
            "/vote",
            "https://shard.dog/nearyear",
            "/nomination",
            "/register",
          ].map((path, index) => {
            const isActive = router.pathname === path;
            const linkText =
              path === "/vote"
                ? "Vote"
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
        <button
          className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded cursor-pointer transition duration-200 hover:shadow-lg"
          onClick={action}
        >
          {label}
        </button>
      </div>
      {menuOpen && (
        <div className="flex flex-col items-center gap-2 mt-2 border-t border-gray-300">
          <Link
            href="/vote"
            className={`text-gray-800 font-bold no-underline py-2 border-b border-gray-300 w-full text-center hover:bg-gray-100 ${
              router.pathname === "/vote"
                ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                : ""
            }`}
          >
            Vote
          </Link>
          <Link
            href="https://shard.dog/nearyear"
            target="_blank"
            className={`text-gray-800 font-bold no-underline py-2 border-b border-gray-300 w-full text-center hover:bg-gray-100 ${
              router.pathname === "https://shard.dog/nearyear"
                ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                : ""
            }`}
          >
            Voter Registration
          </Link>
          <Link
            href="/nomination"
            className={`text-gray-800 font-bold no-underline py-2 border-b border-gray-300 w-full text-center hover:bg-gray-100 ${
              router.pathname === "/nomination"
                ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                : ""
            }`}
          >
            Nominate w List
          </Link>
          <Link
            href="https://alpha.potlock.org/register"
            target="_blank"
            className={`text-gray-800 font-bold no-underline py-2 border-b border-gray-300 w-full text-center hover:bg-gray-100 ${
              router.pathname === "https://alpha.potlock.org/register"
                ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                : ""
            }`}
          >
            Create Project
          </Link>
          <button
            className="bg-gray-200 border-none px-4 py-2 rounded cursor-pointer w-full text-center"
            onClick={action}
          >
            {label}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
