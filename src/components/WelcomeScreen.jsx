import React from 'react';

export default function WelcomeScreen({ onSignInClick, onSignUpClick, logo, primaryColor, secondaryColor, textColor }) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    textAlign: 'center',
    padding: 20,
  };

  const logoStyle = {
    width: '120px',
    height: 'auto',
    marginBottom: 40,
  };

  const sloganStyle = {
    fontSize: 24,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 50,
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
    width: '80%',
    maxWidth: 250,
  };

  const commonButtonStyle = {
    padding: '14px 25px',
    fontSize: 18,
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  };

  const signInButtonStyle = {
    ...commonButtonStyle,
    backgroundColor: primaryColor,
    color: 'white',
  };

  const signUpButtonStyle = {
    ...commonButtonStyle,
    backgroundColor: secondaryColor,
    color: textColor,
    border: `1px solid ${primaryColor}`,
  };

  return (
    <div style={containerStyle}>
      {logo && <img src={logo} alt="Logo" style={logoStyle} />}
      <h1 style={sloganStyle}>Only Together</h1>
      <div style={buttonContainerStyle}>
        <button
          onClick={onSignInClick}
          style={signInButtonStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6ab182'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryColor}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          로그인
        </button>
        <button
          onClick={onSignUpClick}
          style={signUpButtonStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = secondaryColor}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}