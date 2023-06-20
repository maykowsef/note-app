import React, { useState } from 'react';

function Chat() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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', // Replace 'yourAuthToken' with the actual authentication token
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
      <form onSubmit={handleSubmit}>
        <input type="text" value={message} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
      <p>Response: {response}</p>
    </div>
  );
}

export default Chat;
