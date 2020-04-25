import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import EventsPage from './pages/EventsPage';
import BookingsPage from './pages/BookingsPage';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './contexts/auth-context';

function App() {
  const [auth, setAuth] = useState({ token: null, userId: null });

  const login = (token, userId, tokenExpiration) => {
    setAuth({ token, userId });
  };

  const logout = () => {
    setAuth({ token: null, userId: null });
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{ token: auth.token, userId: auth.userId, login, logout }}
      >
        <MainNavigation />
        <main className="main-content">
          <Switch>
            {auth.token && <Redirect from="/" to="/events" exact />}
            {auth.token && <Redirect from="/auth" to="/events" exact />}
            {!auth.token && <Route path="/auth" component={AuthPage} />}
            <Route path="/events" component={EventsPage} />
            {auth.token && <Route path="/bookings" component={BookingsPage} />}
            {!auth.token && <Redirect to="/auth" exact />}
          </Switch>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
