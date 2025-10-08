import { FaGithub, FaRocket } from "react-icons/fa";

const Footer = ({ darkMode }) => {
  return (
    <footer
      className={`w-full py-3 px-2 text-center transition-colors duration-300 ${
        darkMode ? "bg-[rgb(16,25,46)] text-white" : "bg-gray-100 text-gray-700"
      }`}
    >
      <div className="flex flex-wrap justify-center items-center gap-3 text-xs sm:text-sm">
        <a
          href="https://github.com/codeaashu/Helpmate-AI"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1 transition duration-300 ${
            darkMode ? "text-blue-400 hover:text-white" : "text-blue-600 hover:text-black"
          }`}
        >
          <FaGithub /> GitHub
        </a>
        <span className="text-gray-500 hidden sm:block">|</span>
        <a
          href="https://ai.google.dev/competition/projects/helpmate-ai"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1 transition duration-300 ${
            darkMode ? "text-blue-400 hover:text-white" : "text-blue-600 hover:text-black"
          }`}
        >
          <FaRocket /> Vote Now
        </a>
      </div>
      <p className={`text-[10px] sm:text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
        &copy; 2025 HelpMate AI
      </p>
    </footer>
  );
};

export default Footer;
