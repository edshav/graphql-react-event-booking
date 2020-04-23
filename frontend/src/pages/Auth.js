import React, { useState } from 'react';

import './Auth.css';

const Auth = () => {
  const [inputs, setInputs] = useState({ email: '', password: '' });
  const [isLogin, setIsLogin] = useState(true);

  const switchMode = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const { email, password } = inputs;

    const requestBody = isLogin
      ? {
          query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `,
        }
      : {
          query: `
        mutation {
          createUser(userInput: { email: "${email}", password: "${password}" }) {
            _id
            email
          }
        }
      `,
        };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log(res.status);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const inputHandler = (e) => {
    e.persist();
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form className="auth-form" onSubmit={submitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input
          type="email"
          name="email"
          id="email"
          value={inputs.email}
          onChange={inputHandler}
          autoComplete="email"
        />
      </div>
      <div className="form-control">
        <label htmlFor="password">E-Mail</label>
        <input
          type="password"
          name="password"
          id="password"
          value={inputs.password}
          onChange={inputHandler}
          autoComplete="current-password"
        />
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={switchMode}>
          {isLogin ? 'Switch to Sign up' : 'Switch to Login'}
        </button>
      </div>
    </form>
  );
};

export default Auth;
