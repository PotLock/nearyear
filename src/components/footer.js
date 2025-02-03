import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-50 to-teal-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="text-center text-gray-600">
          Built with ❤️ by{" "}
          <a
            href="https://potlock.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-blue-600 transition-colors duration-200"
          >
            🫕 POTLOCK
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
