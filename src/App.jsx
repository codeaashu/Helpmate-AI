import { useState, useEffect, useRef } from "react";
import "./App.css"; // Ensure this file contains your styles
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Footer from "./Footer";
import ShareButtons from "./components/ShareButtons";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null); // Ref to scroll to the latest message

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
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: question, type: "user" },
    ]);
    setQuestion(""); // Clear the input field

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const answer = response.data.candidates[0].content.parts[0].text;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: answer, type: "bot" },
      ]);
    } catch (error) {
      console.log(error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Sorry, something went wrong. Please try again!", type: "bot" },
      ]);
    }
    setGeneratingAnswer(false);
  }

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg flex flex-col">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-4">Helpmate AI</h1>
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${msg.type === "user" ? "text-right" : "text-left"}`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  msg.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
                {msg.type === "bot" && <ShareButtons answer={msg.text} />}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={generateAnswer} className="flex items-center space-x-2">
          <textarea
            required
            className="border border-gray-600 bg-gray-900 text-white rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything..."
            rows={2} // Adjust the number of rows for better UX
          />
          <button
            type="submit"
            className={`bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 ${generatingAnswer ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={generatingAnswer}
          >
            Send
          </button>
          <button type="button" onClick={toggleListening} className={`p-2 rounded-full ${isListening ? "bg-red-500" : "bg-gray-700"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default App;
