import React from 'react';

import './Backdrop.css';

const Backdrop = ({ onDismiss }) => {
  return <div className="backdrop" onClick={onDismiss}></div>;
};

export default Backdrop;
