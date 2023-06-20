import React, { useState } from 'react';
import axios from 'axios';
import "./rwg.css"
const RandomWordGenerator = () => {
  const [randomWord, setRandomWord] = useState('');

  const generateRandomWord = () => {
    axios
      .get('http://localhost:3001/random-word')
      .then((response) => {
        setRandomWord(response.data.word);
      })
      .catch((error) => {
        console.error('Error retrieving random word:', error);
      });
  };

  return (
    <div className='rwg'>
            <div className='rwg-container'>
                <div className='rwg-header-text'><span>Random Word Generator</span></div>
                <div onClick={generateRandomWord} className='grw-btn'>Generate Random Word</div>
                <div className='generated-word'><span>{randomWord}</span></div>
            </div>
    </div>
  );
};

export default RandomWordGenerator;
