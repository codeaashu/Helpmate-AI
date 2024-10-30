import { useEffect, useState } from "react";

const ShareButtons = ({ answer }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [utterance, setUtterance] = useState(null); // State to hold the utterance

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Helpmate AI Answer",
          text: answer,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Share failed:", err);
          handleCopy();
          alert(
            "Sharing failed. The answer has been copied to your clipboard instead."
          );
        }
      }
    } else {
      handleCopy();
      alert(
        "Sharing is not supported on this browser. The answer has been copied to your clipboard instead."
      );
    }
  };

  const handleSpeak = () => {
<<<<<<< HEAD
    const speech = new SpeechSynthesisUtterance(answer);
    window.speechSynthesis.speak(speech);
  };

=======
    // If there is an existing utterance, cancel it before creating a new one
    if (utterance) {
      speechSynthesis.cancel();
    }
    
    const newUtterance = new SpeechSynthesisUtterance(answer);
    speechSynthesis.speak(newUtterance);
    setUtterance(newUtterance); // Set the new utterance
  };

  useEffect(() => {
    return () => {
      // Stop any ongoing speech synthesis when the component unmounts
      if (utterance) {
        speechSynthesis.cancel();
      }
    };
  }, [utterance]);

>>>>>>> 6b114be1dd4f361a41f29760361e1d7a558214dd
  return (
    <div className="flex gap-2 justify-end mt-2">
      <button
        onClick={handleCopy}
        className={`button-secondary transition-all ${
          copySuccess ? "bg-green-500" : "bg-gray-700 hover:bg-blue-500"
        }`}
      >
        {copySuccess ? "Copied!" : "Copy"}
      </button>

      <button
        onClick={handleSpeak}
        className="button-secondary hover:bg-blue-500 transition-all"
      >
        Speak
      </button>

      <button
        onClick={handleShare}
        className="button-secondary hover:bg-blue-500 transition-all"
      >
        Share
      </button>

      <button
        onClick={handleSpeak}
        className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 1v10m0 0v10m0-10h4m-4 0h-4m4 0v-4m0 4v4"
          />
        </svg>
        Speak
      </button>
    </div>
  );
};

export default ShareButtons;
