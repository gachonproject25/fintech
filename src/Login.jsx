import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id && password) {
      onLogin(id);
    } else {
      alert('아이디와 비밀번호를 입력해주세요.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>아이디</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
            autoFocus
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>로그인</button>
      </form>
    </div>
  );
}
