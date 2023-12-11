import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';

const Login = () => {
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await loginUser({ identifier, password });

      if (response.success) {
        const username = response.data.username;
        const jwtToken = response.data.token;
        reactLocalStorage.set("username", username);
        
        reactLocalStorage.set("jwt", jwtToken);
        navigate('/account');
  

      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login request failed');
    }
  };

  const handleSignUpSubmit = (event) => {
    event.preventDefault();
    navigate('/signup');
  };

  return (
    <div>
      {isLoginView ? (
        <>
          <h2>User Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Username or Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <input type="submit" value="Login" />
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={() => setIsLoginView(false)}>New User? Sign Up</button>
        </>
      ) : (
        <>
          <h2>User Sign Up</h2>
          <form onSubmit={handleSignUpSubmit}>
            {/* ... Sign Up form fields ... */}
            <input type="submit" value="Sign Up" />
          </form>
          <button onClick={() => setIsLoginView(true)}>Already have an account? Log In</button>
        </>
      )}
    </div>
  );
}

export default Login;

async function loginUser(credentials) {
  try {
    const response = await fetch('http://localhost:3031/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, message: data.error };
    }
  } catch (error) {
    console.error('Login request failed:', error);
    return { success: false, message: 'Failed to login' };
  }
}