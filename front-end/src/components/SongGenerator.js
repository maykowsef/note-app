import React, { useState } from 'react';

const  SongGenerator = () => {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const handleTextAreaChange = (event) => {
    setText(event.target.value);
  };


let   message=""
    const  handleButtonClick = async (event) => {
        event.preventDefault();
      message="generate random word"
        try {
          const response = await fetch('http://localhost:3001/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer sk-ZpVkqNR2CELAcOwT­phihT3BlbkFJyNOsoGF7­uwm0S7h80gdU', // Replace 'yourAuthToken' with the actual authentication token
            },
            body: JSON.stringify({ prompt: message }),
          });

          const data = await response.json();
          console.log(data)
          setResponse(data.message);
        } catch (error) {
          console.error('Error:', error);
          setResponse('An error occurred');
        }
      };
  return (
    <div>

      <button onClick={handleButtonClick}>generate song </button>
      {response}
    </div>
  );
};

export default SongGenerator;
