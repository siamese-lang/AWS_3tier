import React, { useState } from 'react';

function EntryPage() {
  const [currentView, setCurrentView] = useState("logIn");

  const changeView = (view) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case "signUp":
        return (
          <form>
            <h2>Sign Up!</h2>
            <fieldset>
              <legend>Create Account</legend>
              <ul>
                <li>
                  <label htmlFor="signUpUsername">Username:</label>
                  <input type="text" id="signUpUsername" required />
                </li>
                <li>
                  <label htmlFor="signUpEmail">Email:</label>
                  <input type="email" id="signUpEmail" required />
                </li>
                <li>
                  <label htmlFor="signUpPassword">Password:</label>
                  <input type="password" id="signUpPassword" required />
                </li>
              </ul>
            </fieldset>
            <button type="submit">Submit</button>
            <button type="button" onClick={() => changeView("logIn")}>
              Have an Account?
            </button>
          </form>
        );
      case "logIn":
        return (
          <form>
            <h2>Welcome Back!</h2>
            <fieldset>
              <legend>Log In</legend>
              <ul>
                <li>
                  <label htmlFor="logInUsername">Username:</label>
                  <input type="text" id="logInUsername" required />
                </li>
                <li>
                  <label htmlFor="logInPassword">Password:</label>
                  <input type="password" id="logInPassword" required />
                </li>
                <li>
                  <a onClick={() => changeView("PWReset")} href="#">
                    Forgot Password?
                  </a>
                </li>
              </ul>
            </fieldset>
            <button type="submit">Login</button>
            <button type="button" onClick={() => changeView("signUp")}>
              Create an Account
            </button>
          </form>
        );
      case "PWReset":
        return (
          <form>
            <h2>Reset Password</h2>
            <fieldset>
              <legend>Password Reset</legend>
              <ul>
                <li>
                  <em>A reset link will be sent to your inbox!</em>
                </li>
                <li>
                  <label htmlFor="resetEmail">Email:</label>
                  <input type="email" id="resetEmail" required />
                </li>
              </ul>
            </fieldset>
            <button type="submit">Send Reset Link</button>
            <button type="button" onClick={() => changeView("logIn")}>
              Go Back
            </button>
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
};

export default EntryPage;
