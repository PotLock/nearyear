import Link from "next/link";
import { FaGithub, FaTwitter } from "react-icons/fa";

export const Footer = () => {
  // Use a state to manage the current year
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-50 to-teal-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            &copy; {currentYear} NEAR YEAR Awards. All rights reserved.
          </p>
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a
              href="https://twitter.com/potlock_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center"
            >
              <FaTwitter size={20} />
              <span className="ml-1">Twitter</span>
            </a>
            <a
              href="https://github.com/potlock"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center"
            >
              <FaGithub size={20} />
              <span className="ml-1">GitHub</span>
            </a>
          </div>
        </div>
        <div className="text-center mt-4">
          <p>
            Built with ❤️ by{" "}
            <a
              href="https://potlock.org"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline text-gray-800"
            >
              🫕 POTLOCK
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
