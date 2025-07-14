// src/auth/oidcClient.ts
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import './log'; // Import to initialize logging

const settings = {
    authority: process.env.REACT_APP_AUTH_ISSUER! || 'https://localhost:5006',
    client_id: process.env.REACT_APP_AUTH_CLIENT_ID! || '328404667920875523',
    redirect_uri: process.env.REACT_APP_AUTH_REDIRECT_URI! || 'https://localhost:5006/callback',
    post_logout_redirect_uri: process.env.REACT_APP_AUTH_LOGOUT_REDIRECT_URI! || 'https://localhost:5006/',
    response_type: 'code',
    scope: 'openid profile email phone address offline_access',
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    stateStore: new WebStorageStateStore({ store: window.sessionStorage }),
    automaticSilentRenew: true,
    silent_redirect_uri: "http://localhost:5006/silent-renew.html"
};

const userManager = new UserManager(settings);

export default userManager;
