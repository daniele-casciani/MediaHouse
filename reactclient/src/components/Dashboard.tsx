import { useEffect, useState } from 'react';
import { UserManager, User } from 'oidc-client-ts';

type Props = {
    userManager: UserManager;
    user: User;
    handleLogout: () => void;
};

const Dashboard = ({ userManager, user, handleLogout }: Props) => {
    const [roles, setRoles] = useState<string[]>([]);
    const [response, setResponse] = useState<string | null>(null);

    useEffect(() => {
        console.log("Server response:", response);
    }, [response]);

    useEffect(() => {
        const roleMap = user?.profile?.["urn:zitadel:iam:org:project:roles"];
        if (roleMap && typeof roleMap === 'object') {
            const allRoles = Object.keys(roleMap); // ["journalist", ...]
            setRoles(allRoles);
            console.log("User roles:", allRoles);
        }
    }, [user]);


    const callApi = async (endpoint: string, method: 'GET' | 'POST') => {
        try {
            const res = await fetch(`https://server.dani.genogra.com/${endpoint}`, {
                method,
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setResponse(data.message);
        } catch (err: any) {
            setResponse(`Errore: ${err.message}`);
        }
    };

    return (
        <div>
            <h2>Welcome {user.profile.name}</h2>
            <p>Email: {user.profile.email}</p>
            <p>Roles: {roles.join(', ') || 'No roles yet'}</p>

            <h4>Available actions</h4>

            <button onClick={() => callApi('write_article', 'POST')}>Write Article</button>
            <button onClick={() => callApi('edit_article', 'POST')}>Edit Article</button>
            <button onClick={() => callApi('review_articles', 'GET')}>Review Articles</button>
            <button onClick={() => callApi('publish_article', 'POST')}>Publish Article</button>
            <button onClick={handleLogout}>Logout</button>
        

            {response && <p><strong>Server Response:</strong> {response}</p>}
        </div>
    );
};

export default Dashboard;
