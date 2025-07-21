// src/components/Callback.tsx
import { useEffect, useState } from "react";
import { UserManager, User } from "oidc-client-ts";
import Dashboard from "./Dashboard";

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
        return <Dashboard userManager={userManager} user={userInfo} handleLogout={handleLogout} />;
    }

    return (
        <div>
            <h2>Authentication Failed</h2>
            <p>Please try logging in again.</p>
            <button onClick={() => userManager.signinRedirect()}>Try Again</button>
        </div>
    );
};

export default Callback;