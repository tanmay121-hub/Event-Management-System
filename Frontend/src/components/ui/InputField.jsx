import React from 'react';

const InputField = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`input-group ${className}`} style={{ marginBottom: '1rem' }}>
      {label && <label>{label}</label>}
      <input 
        className={error ? 'input-error' : ''} 
        style={{ marginBottom: error ? '4px' : '1rem' }}
        {...props} 
      />
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{error}</span>}
    </div>
  );
};

export default InputField;
