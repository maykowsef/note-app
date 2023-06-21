import React, { useState } from 'react';

const Affirmations = () => {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');
  const handleTextAreaChange = (event) => {
    setText(event.target.value);
  };


let   message=""
    const  handleButtonClick = async (event) => {
        event.preventDefault();
      message="change these affirmations to opposite prounouns from i am to you are and you are to i am , just the line i wrote don't add anything"+text
        try {
          const response = await fetch('http://localhost:3001/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ..', // Replace 'yourAuthToken' with the actual authentication token
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
      <textarea
        rows={4}
        cols={50}
        value={text}
        onChange={handleTextAreaChange}
      />
      <button onClick={handleButtonClick}>Retrieve Text</button>
      {response}
    </div>
  );
};

export default Affirmations;
