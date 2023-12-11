import React, { Component } from 'react';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      errors: {},
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = this.state;

    // Basic client-side validation
    const errors = {};
    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Invalid email address';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    // Continue with form submission to the server
    try {
      const response = await fetch('http://localhost:3031/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

     
      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
      alert('Sign-up successful!');
      this.resetForm();
    } catch (error) {
      console.error('Error:', error);
      this.setState({ errors: { general: error.message } });
    }
  };

  resetForm = () => {
    this.setState({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      errors: {},
    });
  };

  render() {
    const { username, email, password, confirmPassword, errors } = this.state;

    return (
      <div>
        <h2>Sign Up</h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={this.handleChange}
              required
            />
            {errors.username && <div className="error">{errors.username}</div>}
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={this.handleChange}
              required
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={this.handleChange}
              required
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={this.handleChange}
              required
            />
            {errors.confirmPassword && (
              <div className="error">{errors.confirmPassword}</div>
            )}
          </div>
          {errors.general && <div className="error">{errors.general}</div>}
          <button type="submit">Sign Up</button>
        </form>
      </div>
    );
  }
}

export default SignUp;
