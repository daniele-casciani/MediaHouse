// src/components/Callback.tsx
import { useEffect, useState } from "react";
import { UserManager, User } from "oidc-client-ts";

type Props = {
    authenticated: boolean | null;
    setAuth: (authenticated: boolean | null) => void;
    userManager: UserManager;
    handleLogout: any;
};

const fetchUserInfo = async (accessToken: string, authority: string) => {
    const res = await fetch(`${authority}/oidc/v1/userinfo`, {
        headers: {
        Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!res.ok) throw new Error('Userinfo fetch failed');
    return res.json();
};

const Callback = ({
    authenticated,
    setAuth,
    userManager,
    handleLogout,
}: Props) => {
    const [userInfo, setUserInfo] = useState<User | null>(null); 
    const [loading, setLoading] = useState<boolean>(true); // to manage wait the user info fetch before rendering
  
    useEffect(() => {
        const handleCallbackAndLoadUser = async () => {
        try {
            // 1. Gestisce redirect callback
            const user = await userManager.signinCallback();
            console.log("[Callback] User signed in:", user);
            setAuth(true);

            // 2. Recupera info utente dettagliate
            const profile = await fetchUserInfo(user!.access_token, userManager.settings.authority);
            user!.profile = profile;

            setUserInfo(user!);
        } catch (error) {
            console.error("Callback or userinfo error:", error);
            setAuth(false);
        } finally {
            setLoading(false);
        }
        };
        handleCallbackAndLoadUser();
    }, [setAuth, userManager]);

    if (loading) return <div>Loading...</div>;

    if (authenticated && userInfo) {
        return (
        <div className="user">
            <h2>Welcome, {userInfo.profile.name}!</h2>
            <p className="description">Your ZITADEL Profile Information</p>
            <p>Name: {userInfo.profile.name}</p>
            <p>Email: {userInfo.profile.email}</p>
            <p>Email Verified: {userInfo.profile.email_verified ? "Yes" : "No"}</p>
            <p>
            Roles:{" "}
            {JSON.stringify(
                userInfo.profile["urn:zitadel:iam:org:project:roles"]
            )}
            </p>
            <button onClick={handleLogout}>Log out</button>
        </div>
        );
    }
    return (
        <div>
            <h2>Authentication Failed</h2>
            <p>Please try logging in again.</p>
            <button onClick={() => userManager.signinRedirect()}>Login</button>
        </div>
    );
};

export default Callback;