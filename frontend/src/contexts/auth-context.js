import React from 'react';

export default React.createContext({
  tokem: null,
  userId: null,
  login: () => {},
  logout: () => {},
});
