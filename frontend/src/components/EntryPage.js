import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css'; 

function EntryPage() {
  const [currentView, setCurrentView] = useState("logIn");
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const changeView = (view) => {
    setCurrentView(view);
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    const url = currentView === "signUp" ? `${apiUrl}/api/register` : 
                currentView === "logIn" ? `${apiUrl}/api/login` : 
                `${apiUrl}/api/reset-password`;

    const formBody = new URLSearchParams(formData).toString();

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody,
      credentials: 'include'  // 이 부분 추가
    };

    fetch(url, options)
      .then(response => {
        if (response.ok) {
          if (currentView === "logIn") {
            navigate('/home'); // 로그인 성공 시 /home으로 이동
          } else {
            alert('Operation successful');
            if (currentView === "signUp") changeView("logIn");
          }
        } else {
          alert('Operation failed');
        }
      })
      .catch(error => {
        setError(`Operation failed: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderView = () => {
    switch (currentView) {
      case "signUp":
        return (
          <form onSubmit={handleSubmit}>
            <h2>Sign Up!</h2>
            <fieldset>
              <legend>Create Account</legend>
              <ul>
                <li>
                  <label htmlFor="username">Username:</label>
                  <input type="text" id="username" value={formData.username} onChange={handleInputChange} required />
                </li>
                <li>
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" value={formData.email} onChange={handleInputChange} required />
                </li>
                <li>
                  <label htmlFor="password">Password:</label>
                  <input type="password" id="password" value={formData.password} onChange={handleInputChange} required />
                </li>
              </ul>
            </fieldset>
            <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
            <button type="button" onClick={() => changeView("logIn")} disabled={loading}>
              Have an Account?
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        );
      case "logIn":
        return (
          <form onSubmit={handleSubmit}>
            <h2>Welcome Back!</h2>
            <fieldset>
              <legend>Log In</legend>
              <ul>
                <li>
                  <label htmlFor="username">Username:</label>
                  <input type="text" id="username" value={formData.username} onChange={handleInputChange} required />
                </li>
                <li>
                  <label htmlFor="password">Password:</label>
                  <input type="password" id="password" value={formData.password} onChange={handleInputChange} required />
                </li>
                <li>
                  <a onClick={() => changeView("PWReset")} href="#">
                    Forgot Password?
                  </a>
                </li>
              </ul>
            </fieldset>
            <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
            <button type="button" onClick={() => changeView("signUp")} disabled={loading}>
              Create an Account
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        );
      case "PWReset":
        return (
          <form onSubmit={handleSubmit}>
            <h2>Reset Password</h2>
            <fieldset>
              <legend>Password Reset</legend>
              <ul>
                <li>
                  <em>A reset link will be sent to your inbox!</em>
                </li>
                <li>
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" value={formData.email} onChange={handleInputChange} required />
                </li>
              </ul>
            </fieldset>
            <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
            <button type="button" onClick={() => changeView("logIn")} disabled={loading}>
              Go Back
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <section id="entry-page">
      {renderView()}
    </section>
  );
}

export default EntryPage;
