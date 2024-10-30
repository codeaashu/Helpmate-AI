const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-10 w-full">
      <div className="container mx-auto text-center">
        <h3 className="text-lg font-semibold mb-2">Helpmate AI</h3>
        <p className="text-sm mb-4">Your AI companion for all your questions.</p>
        <div className="space-x-4">
          <a
            href="https://github.com/codeaashu/Helpmate-AI"
            className="hover:text-blue-400"
          >
            GitHub
          </a>
          <span>|</span>
          <a
            href="https://devdisplay.vercel.app/"
            className="hover:text-blue-400"
          >
            Spotlight
          </a>
        </div>
        <p className="mt-4 text-xs text-white">
          © 2024 Helpmate AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
