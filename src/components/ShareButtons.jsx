import { useState } from "react";
import PropTypes from 'prop-types';

const ShareButtons = ({ answer }) => {
  const [copySuccess, setCopySuccess] = useState(false);

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
          text: answer, // Share the answer text instead of the URL
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Share failed:", err);
          // Fallback to copy if sharing fails
          handleCopy();
          alert(
            "Sharing failed. The answer has been copied to your clipboard instead."
          );
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopy();
      alert(
        "Sharing is not supported on this browser. The answer has been copied to your clipboard instead."
      );
    }
  };

  return (
    <div className="flex gap-2 justify-end mt-2">
      <button
        onClick={handleCopy}
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
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        {copySuccess ? "Copied!" : "Copy"}
      </button>

      <button
        onClick={handleShare}
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
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        Share
      </button>
    </div>
  );
};

ShareButtons.propTypes = {
  answer: PropTypes.string.isRequired,
};

export default ShareButtons;