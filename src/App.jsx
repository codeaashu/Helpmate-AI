import { useState, useEffect } from "react";
import "./App.css"; // Make sure to import the CSS with the new animations
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Footer from "./Footer";
import ShareButtons from "./components/ShareButtons";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  async function generateAnswer(e) {
    e.preventDefault();
    setGeneratingAnswer(true);
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const fullAnswer = response.data.candidates[0].content.parts[0].text;
      setAnswer(fullAnswer); // Store the full answer
    } catch (error) {
      console.error(error);
      setAnswer("Sorry, something went wrong. Please try again!");
    } finally {
      setGeneratingAnswer(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex flex-col items-center justify-center bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 p-6 text-white">
        <div className="flex flex-col items-center w-full max-w-3xl">
          <a
            href="https://github.com/codeaashu/Helpmate-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center mb-20"
          >
            <h1 className="text-5xl font-bold text-blue-400 mb-2">
              Helpmate AI
            </h1>
            <p className="text-md text-gray-400">Your AI assistant at your fingertips</p>
          </a>
          <form
            onSubmit={generateAnswer}
            className="w-full text-center bg-gray-900 p-6 rounded-lg shadow-lg"
          >
            <p className="text-left mb-4 text-xl font-semibold text-blue-400">How can I help you?</p>
            <div className="relative w-full mb-6">
              <textarea
                required
                className="border border-gray-700 bg-gray-800 text-white rounded-lg w-full p-4 h-32 resize-none focus:border-blue-500 focus:shadow-lg focus:bg-transparent outline-none"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask your AI mate..."
              />
              {recognition && (
               <button
               type="button"
               onClick={() => {
                 toggleListening();
                 setIsListening(!isListening); // Toggle listening state
               }}
               className={`absolute right-4 -top-11 p-2 rounded-full transition-transform duration-300 ease-in-out ${
                 isListening ? "bg-red-500 scale-105 flicker" : "bg-blue-500 scale-100"
               } hover:opacity-80 active:scale-95`}
             >
               <FaMicrophone className="text-white" />
             </button>
              )}
              <button
                type="submit"
                className={`absolute right-4 top-2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 overflow-hidden`}
                disabled={generatingAnswer}
              >
                <FaPaperPlane className={`text-white ${generatingAnswer ? 'send-animation' : ''}`} />
              </button>
            </div>
          </form>
          {generatingAnswer ? (
            <div className="w-full text-center bg-gray-900 p-6 mt-6 rounded-lg shadow-lg animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          ) : answer && (
            <div className="w-full text-left bg-gray-900 p-6 mt-6 rounded-lg shadow-lg answer-container">
              <ReactMarkdown>{answer}</ReactMarkdown>
              <ShareButtons answer={answer} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
