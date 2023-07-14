import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const fakeAuth = {
  isAuthenticated: false,
  authenticate(callback) {
    this.isAuthenticated = true;
    setTimeout(callback, 100); // Simulate an asynchronous request
  },
  signout(callback) {
    this.isAuthenticated = false;
    setTimeout(callback, 100);
  }
};

function Home() {
  return <h2>Welcome to the app!</h2>;
}

function Dashboard() {
  return <h2>Dashboard</h2>;
}

function Login() {
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const login = () => {
    fakeAuth.authenticate(() => {
      setRedirectToReferrer(true);
    });
  };

  if (redirectToReferrer) {
    // eslint-disable-next-line react/jsx-no-undef
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      <h2>Login</h2>
      <button onClick={login}>Log in</button>
    </div>
  );
}

function PrivateRoute({ children }) {
  const isAuthenticated = fakeAuth.isAuthenticated;

  return (
    <Route
      render={({ location }) =>
        isAuthenticated === true ? (
          children
        ) : (
          // eslint-disable-next-line react/jsx-no-undef
          <Navigate
            to="/login"
            state={{ from: location }}
          />
        )
      }
    />
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    fakeAuth.signout(() => {
      setIsAuthenticated(false);
    });
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {isAuthenticated ? (
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            ) : null}
            <li>
              {isAuthenticated ? (
                <button onClick={logout}>Logout</button>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/dashboard">
            <Dashboard />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
