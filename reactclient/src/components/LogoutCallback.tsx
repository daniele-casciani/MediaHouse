import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userManager from "../auth/oidcClient"; // importa il tuo userManager

const LogoutCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogoutCallback = async () => {
            try {
                console.log("[LogoutCallback] Handling logout callback...");
                const logoutResponse = await userManager.signoutCallback();
                console.log("[LogoutCallback] Logout successful:", logoutResponse);
            } catch (error) {
                console.error("[LogoutCallback] Error handling logout callback:", error);
            }
        };

        handleLogoutCallback();
    }, []);

    return (
        <div>
            <h2>Logged out</h2>
            <p>You have been successfully logged out.</p>
            {/* Optionally, you can display the user's name if in the userManager */}
            <button onClick={() => navigate("/")}>Go to Login</button>
        </div>
    );
};

export default LogoutCallback;
