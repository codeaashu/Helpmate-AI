import { useState, useEffect } from "react";
import {
  Copy,
  Send,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Share2,
  Check,
  Mic,
  MicOff,
} from "lucide-react";

const cache = new Map();

import Footer from "./Footer";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 500);
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
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
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const toggleSpeaking = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const shareContent = async (text) => {
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        console.log("Share cancelled");
      }
    } else {
      copyToClipboard(text, -1);
    }
  };

  const handleSubmit = async () => {
    if (!question.trim() || generatingAnswer) return;

    setGeneratingAnswer(true);
    const userQuestion = question;
    setQuestion("");

    setChatHistory((prev) => [
      ...prev,
      { type: "question", text: userQuestion },
    ]);

    if (cache.has(userQuestion)) {
      setChatHistory((prev) => [
        ...prev,
        { type: "answer", text: cache.get(userQuestion) },
      ]);
      setGeneratingAnswer(false);
      return;
    }

    const apiKey = import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT;
    let attempts = 0;
    const maxAttempts = 3;
    let delay = 2000;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: userQuestion }] }],
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 429) {
            throw { response: { status: 429 } };
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (data?.candidates?.length > 0) {
          const fullAnswer = data.candidates[0].content.parts[0].text;
          cache.set(userQuestion, fullAnswer);
          setChatHistory((prev) => [
            ...prev,
            { type: "answer", text: fullAnswer },
          ]);
        } else {
          throw new Error("Invalid API response structure");
        }
        break;
      } catch (error) {
        console.error("API Error:", error);

        if (error.response?.status === 429) {
          if (attempts < maxAttempts - 1) {
            console.warn(`Rate limit hit. Retrying in ${delay / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2;
            attempts++;
          } else {
            setChatHistory((prev) => [
              ...prev,
              { type: "answer", text: "Rate limit exceeded. Please try again later." },
            ]);
            break;
          }
        } else {
          setChatHistory((prev) => [
            ...prev,
            { type: "answer", text: "Sorry, something went wrong. Please try again!" },
          ]);
          break;
        }
      }
    }

    setGeneratingAnswer(false);
  };

  const bgGradient = darkMode
    ? "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
    : "bg-gradient-to-br from-blue-50 via-white to-indigo-50";
  const navBg = darkMode ? "bg-slate-900/80" : "bg-white/80";
  const chatBg = darkMode ? "bg-slate-800/50" : "bg-white/70";
  const userBubble = darkMode
    ? "bg-gradient-to-r from-blue-600 to-blue-500"
    : "bg-gradient-to-r from-blue-500 to-indigo-500";
  const aiBubble = darkMode ? "bg-slate-700/70" : "bg-slate-100";
  const textColor = darkMode ? "text-white" : "text-slate-900";
  const mutedText = darkMode ? "text-slate-400" : "text-slate-600";

  return (
    <div
      className={`min-h-screen ${bgGradient} ${textColor} transition-all duration-700 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Navbar */}
      <nav
        className={`${navBg} backdrop-blur-md border-b ${
          darkMode ? "border-slate-700" : "border-slate-200"
        } sticky top-0 z-50`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                  darkMode
                    ? "from-blue-500 to-purple-600"
                    : "from-blue-400 to-indigo-500"
                } flex items-center justify-center shadow-lg`}
              >
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Helpmate AI
                </h1>
                <p className={`text-xs ${mutedText}`}>
                  Your intelligent assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-lg ${
                darkMode
                  ? "bg-slate-700 hover:bg-slate-600"
                  : "bg-slate-200 hover:bg-slate-300"
              } transition-all duration-300`}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div
              className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${
                darkMode
                  ? "from-blue-500 to-purple-600"
                  : "from-blue-400 to-indigo-500"
              } flex items-center justify-center shadow-2xl animate-pulse`}
            >
              <span className="text-white font-bold text-4xl">H</span>
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold">
                Hello! How can I help you today?
              </h2>
              <p className={`${mutedText} text-lg`}>
                Ask me anything, I am here to assist
              </p>
            </div>

            {/* Hero Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl mt-8">
              {[
                "Write a poem about AI",
                "Help me plan a trip",
                "Tips for learning coding"
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => setQuestion(prompt)}
                  className={`p-4 rounded-xl ${chatBg} backdrop-blur-sm border shadow-md ${
                    darkMode
                      ? "border-slate-700 hover:border-blue-500"
                      : "border-slate-200 hover:border-blue-400"
                  } transition-all duration-300 text-center hover:scale-105`}
                >
                  <p className="font-medium">{prompt}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat Area */
          <div className="space-y-6">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.type === "question" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-lg ${
                    chat.type === "question"
                      ? `${userBubble} text-white`
                      : `${aiBubble} ${
                          darkMode ? "text-slate-100" : "text-slate-800"
                        }`
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {chat.text}
                  </div>
                  {chat.type === "answer" && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-500/30">
                      <button
                        onClick={() => toggleSpeaking(chat.text)}
                        className={`p-2 rounded-lg transition-all ${
                          darkMode ? "hover:bg-slate-600" : "hover:bg-slate-200"
                        }`}
                        title={isSpeaking ? "Stop" : "Read aloud"}
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(chat.text, index)}
                        className={`p-2 rounded-lg transition-all ${
                          darkMode ? "hover:bg-slate-600" : "hover:bg-slate-200"
                        }`}
                        title="Copy"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => shareContent(chat.text)}
                        className={`p-2 rounded-lg transition-all ${
                          darkMode ? "hover:bg-slate-600" : "hover:bg-slate-200"
                        }`}
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {generatingAnswer && (
              <div className="flex justify-start animate-fade-in">
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 ${aiBubble} shadow-lg`}
                >
                  <div className="flex space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        darkMode ? "bg-blue-400" : "bg-blue-500"
                      } animate-bounce`}
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        darkMode ? "bg-blue-400" : "bg-blue-500"
                      } animate-bounce`}
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        darkMode ? "bg-blue-400" : "bg-blue-500"
                      } animate-bounce`}
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Input */}
        <div className="fixed bottom-20 left-0 right-0 px-4">
          <div className="max-w-4xl mx-auto">
            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-2xl shadow-lg border transition-all duration-300 ${
                darkMode
                  ? "bg-slate-800/90 border-slate-700"
                  : "bg-white/90 border-slate-200"
              }`}
            >
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask me anything..."
                rows={1}
                className={`flex-1 bg-transparent outline-none resize-none py-2 text-sm leading-relaxed ${textColor}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              {recognition && (
                <button
                  onClick={toggleListening}
                  className={`p-3 rounded-xl transition-all duration-300 shadow-md ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-slate-600 hover:bg-slate-500"
                  }`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5 text-white" />
                  ) : (
                    <Mic className="w-5 h-5 text-white" />
                  )}
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={generatingAnswer || !question.trim()}
                className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 shadow-md"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t bg-gradient-to-t from-black/20 to-transparent backdrop-blur-md"
        style={{
          borderColor: darkMode ? "rgb(51, 65, 85)" : "rgb(226, 232, 240)",
        }}
      >
        <Footer darkMode={darkMode} />
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;