import React, { useState } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import ReactPlayer from 'react-player';
const TextToSpeech = () => {
  const [text, setText] = useState('');
  const { speak } = useSpeechSynthesis();
  let url
  const handleSpeak = () => {
    if (text) {
      speak({ text });
    }
  };

  const handleDownload = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const synth = window.speechSynthesis;

      // Create a new SpeechSynthesisUtterance and assign the text
      const downloadUtterance = new SpeechSynthesisUtterance(text);

      // Wait for the speech synthesis to complete
      downloadUtterance.addEventListener('end', () => {
        console.log(SpeechSynthesisUtterance.audio)
        const blob = new Blob([downloadUtterance.audio], { type: 'audio/mpeg' });
         url = URL.createObjectURL(blob);
console.log(url)
        const link = document.createElement('a');
        console.log(link)
        link.href = url;
        link.download = 'text_to_speech.mp3';
        link.click();

        // Clean up the URL object
        URL.revokeObjectURL(url);
      });

      // Start the speech synthesis for downloading
      synth.speak(downloadUtterance);
    }
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to speak"
      />

      <button onClick={handleSpeak}>Speak</button>
      <button onClick={handleDownload}>Download MP3</button>
    </div>
  );
};

export default TextToSpeech;
