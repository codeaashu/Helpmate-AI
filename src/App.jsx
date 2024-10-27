import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Footer from "./Footer";

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
    setGeneratingAnswer(true);
    e.preventDefault();
    setAnswer("Loading your answer... \n It might take up to 10 seconds");
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

      setAnswer(
        response["data"]["candidates"][0]["content"]["parts"][0]["text"]
      );
    } catch (error) {
      console.log(error);
      setAnswer("Sorry, Something went wrong. Please try again!");
    }
    setGeneratingAnswer(false);
  }

  return (
    <>
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black h-screen p-6 flex flex-col justify-center items-center text-white">
        <div className=" flex flex-col items-center overflow-y-auto  w-full overflow-x-hidden">
          <form
            onSubmit={generateAnswer}
            className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 text-center rounded-lg shadow-2xl bg-gray-900 py-8 px-6 transition-all duration-500 transform hover:scale-105"
          >
            <a
              href="https://github.com/codeaashu/Helpmate-AI"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h1 className="text-4xl font-bold text-blue-400 mb-4 animate-bounce">
                Helpmate AI
              </h1>
            </a>
            <div className="relative w-full">
              <textarea
                required
                className="border border-gray-700 bg-gray-800 text-white rounded-lg w-full my-3 min-h-fit p-4 transition-all duration-300 focus:border-blue-500 focus:shadow-lg focus:bg-gray-700"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Take help with your AI mate!"
              ></textarea>
              {recognition && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                    isListening ? "bg-red-500" : "bg-blue-500"
                  } hover:opacity-80 transition-all duration-300`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              className={`bg-blue-600 text-white py-3 px-6 rounded-md shadow-md hover:bg-blue-700 transition-all duration-300 ${
                generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={generatingAnswer}
            >
              Generate answer
            </button>
          </form>
          {/* Conditional Rendering for ReactMarkdown */}
          {answer && (
            <div className="w-full md:w-2/3 lg:w-1/3 xl:w-1/3 text-center rounded-lg bg-gray-900 my-6 shadow-2xl transition-all duration-500 transform hover:scale-105">
              <ReactMarkdown className="p-4">{answer}</ReactMarkdown>
            </div>
          )}
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
