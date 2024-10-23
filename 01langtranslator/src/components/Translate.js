import React, { useEffect, useState } from "react";
import countries from "../data";

const Translate = () => {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromLang, setFromLang] = useState("en-GB");
  const [toLang, setToLang] = useState("hi-IN");
  const [isLoading, setIsLoading] = useState(false);

  // Dynamically populate language options
  useEffect(() => {
    const selectTags = document.querySelectorAll("select");
    selectTags.forEach((tag, id) => {
      for (let country_code in countries) {
        let selected =
          id === 0
            ? country_code === "en-GB"
              ? "selected"
              : ""
            : country_code === "hi-IN"
            ? "selected"
            : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
      }
    });
  }, []);

  // Swap languages and text
  const handleExchange = () => {
    let tempText = fromText;
    let tempLang = fromLang;
    setFromText(toText);
    setToText(tempText);
    setFromLang(toLang);
    setToLang(tempLang);
  };

  // Translation function
  const handleTranslate = async () => {
    if (!fromText.trim()) return;
    setIsLoading(true);
    setToText("Translating...");

    let apiUrl = `https://api.mymemory.translated.net/get?q=${fromText}&langpair=${fromLang}|${toLang}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (response.ok) {
        const translation = data.responseData.translatedText;
        setToText(translation);
      } else {
        throw new Error("Translation API error");
      }
    } catch (error) {
      console.error("Translation error:", error);
      setToText("Error: Could not translate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Copy text to clipboard
  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(
      () => alert("Text copied to clipboard!"),
      () => alert("Failed to copy text.")
    );
  };

  // Text-to-Speech functionality
  const handleSpeak = (text, lang) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="text-input">
          <textarea
            spellCheck="false"
            className="from-text"
            placeholder="Enter text"
            value={fromText}
            onChange={(e) => setFromText(e.target.value)}
          />
          <textarea
            spellCheck="false"
            readOnly
            disabled
            className="to-text"
            placeholder={isLoading ? "Translating..." : "Translation"}
            value={toText}
          />
        </div>
        <ul className="controls">
          <li className="row from">
            <div className="icons">
              <i
                id="from"
                className="fas fa-volume-up"
                onClick={() => handleSpeak(fromText, fromLang)}
              />
              <i
                id="from"
                className="fas fa-copy"
                onClick={() => handleCopy(fromText)}
              />
            </div>
            <select value={fromLang} onChange={(e) => setFromLang(e.target.value)}></select>
          </li>
          <li className="exchange" onClick={handleExchange}>
            <i className="fas fa-exchange-alt"></i>
          </li>
          <li className="row to">
            <select value={toLang} onChange={(e) => setToLang(e.target.value)}></select>
            <div className="icons">
              <i
                id="to"
                className="fas fa-volume-up"
                onClick={() => handleSpeak(toText, toLang)}
              />
              <i
                id="to"
                className="fas fa-copy"
                onClick={() => handleCopy(toText)}
              />
            </div>
          </li>
        </ul>
      </div>
      <button onClick={handleTranslate} disabled={isLoading}>
        {isLoading ? "Translating..." : "Translate Text"}
      </button>
    </div>
  );
};

export default Translate;
