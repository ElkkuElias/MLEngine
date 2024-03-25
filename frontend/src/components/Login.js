import React, { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
        email: email,
        password: password
      };
    
      fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      .then(response => response.json())
      .then(data => {
        sessionStorage.setItem('userID', data.userID);
        console.log(data);
    })
      .catch((error) => {
        console.error('Error:', error);
      });
    };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
};

export default LoginForm;