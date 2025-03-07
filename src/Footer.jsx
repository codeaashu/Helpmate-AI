import { FaGithub, FaRocket } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-white py-4 text-center shadow-lg w-full">
      <div className="container mx-auto px-4">
        <h3 className="text-xl font-semibold mb-2 tracking-wide">HelpMate AI</h3>
        <p className="text-sm text-gray-300 mb-4">
          Your AI companion for instant answers to any question.
        </p>
        <div className="flex justify-center space-x-4 mb-3">
          <a
            href="https://github.com/codeaashu/Helpmate-AI"
            className="text-blue-400 hover:text-white transform hover:scale-110 transition duration-300 flex items-center"
          >
            <FaGithub className="mr-1" /> GitHub
          </a>
          <span className="text-gray-500">|</span>
          <a
            href="https://devdisplay.vercel.app/"
            className="text-blue-400 hover:text-white transform hover:scale-110 transition duration-300 flex items-center"
          >
            <FaRocket className="mr-1" /> Spotlight
          </a>
        </div>
        <p className="text-xs text-gray-500">&copy; 2024 HelpMate AI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;