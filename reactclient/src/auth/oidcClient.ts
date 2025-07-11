// src/auth/oidcClient.ts
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import './log'; // Import to initialize logging

const settings = {
    authority: process.env.REACT_APP_AUTH_ISSUER!, 
    client_id: process.env.REACT_APP_AUTH_CLIENT_ID!,  
    redirect_uri: process.env.REACT_APP_AUTH_REDIRECT_URI!,
    post_logout_redirect_uri: process.env.REACT_APP_AUTH_LOGOUT_REDIRECT_URI!,
    response_type: 'code',
    scope: 'openid profile email phone address offline_access',
    userStore: new WebStorageStateStore({ store: window.localStorage }),
};

const userManager = new UserManager(settings);

export default userManager;
