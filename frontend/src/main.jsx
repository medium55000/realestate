import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './index.css';
// import '@mantine/core/styles.css';
// import '@mantine/dates/styles.css';
import { Auth0Provider } from '@auth0/auth0-react';
import { MantineProvider } from '@mantine/core'; // Import MantineProvider
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
//const redirect_uri = import.meta.env.VITE_REDIRECT_URI;
const redirect_uri =
  import.meta.env.VITE_REDIRECT_URI || window.location.origin;
const audience = import.meta.env.VITE_AUDIENCE;

// ReactDOM.createRoot(
//   document.getElementById('root')).render(
ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirect_uri,
        ...(audience ? { audience } : {}),
        scope: 'openid profile email',
      }}
      cacheLocation="localstorage"
      useRefreshTokens>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <App />
      </MantineProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
