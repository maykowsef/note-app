import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './lsu.css'
const LoginSignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate=useNavigate();
  const handleToggle = () => {
    setIsLogin(!isLogin);
  };



  const token = localStorage.getItem('token');
  const authenticated = token !== null;

  useEffect(() => {
    if (authenticated) {
console.log("heufjerkgf")
    }



  }, [token]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login logic here
      console.log('Logging in...');
      console.log('Username:', username);
      console.log('Password:', password);

      try {
        const response = await fetch('http://localhost:3001/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json(); // Parse the response JSON
          const token = data.token; // Extract the token from the response

          localStorage.setItem('token', token);
          // Login successful
          alert('Login successful');
          navigate("/notes");

          // Perform any necessary actions after successful login
        } else {
          // Login failed
          alert('Login failed');
          // Handle login failure, display error message, etc.
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle network error or other exceptions
      }
    } else {
      // Handle sign-up logic here
      console.log('Signing up...');


      try {
        const response = await fetch('http://localhost:3001/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          // Sign up successful
          alert('Sign up successful');
          // Perform any necessary actions after successful sign up
        } else {
          // Sign up failed
          alert('Sign up failed');
          // Handle sign-up failure, display error message, etc.
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle network error or other exceptions
      }
    }
  };

  return (
    <div className='form'>
      <div className='authent'>{isLogin ? 'Sign in' : 'Sign up'}</div>
      <form >
        <div>
          <div className='form-label'>Username:</div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <div className='form-label'>Password:</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div  className='authent-btn' onClick={handleSubmit}>{isLogin ? 'Login' : 'Sign Up'}</div>
      </form>
      <div className='signup-wrap'>

        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <div className='authent-btn' onClick={handleToggle}>
          {isLogin ? 'Sign Up' : 'Login'}
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
