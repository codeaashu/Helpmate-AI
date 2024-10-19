import { useState } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Footer from "./Footer";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

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
            <textarea
              required
              className="border border-gray-700 bg-gray-800 text-white rounded-lg w-full my-3 min-h-fit p-4 transition-all duration-300 focus:border-blue-500 focus:shadow-lg focus:bg-gray-700"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Take help with your AI mate!"
            ></textarea>
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
