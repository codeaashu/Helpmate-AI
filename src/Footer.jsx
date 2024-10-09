const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 text-center shadow-md mt-8">
      {" "}
      {/* Added mt-8 for top margin */}
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold mb-4">Powered by HelpMate AI</h3>
        <p className="text-sm text-gray-400 mb-6">
          Helpmate is an AI ChatBot web app where you can ask any question and you will get the answer.
        </p>

        <div className="flex justify-center space-x-4 mb-6">
          <a
            href="https://github.com/codeaashu/Helpmate-AI"
            className="text-blue-400 hover:underline transition duration-300 ease-in-out"
          >
            GitHub
          </a>
          <span className="text-gray-400">|</span>
          <a
            href="https://devdisplay.vercel.app/"
            className="text-blue-400 hover:underline transition duration-300 ease-in-out"
          >
            Spotlight
          </a>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>&copy; 2024 Helpmate AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
