import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

// This middleware checks if the request has a valid token in the Authorization header
export const tokenRequired = async (req: Request, res: Response, next: NextFunction) => {
	console.log('[tokenRequired] Checking token in request...');
	const authHeader = req.headers.authorization;
	
	if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });
	
	console.log('[tokenRequired] Authorization header found:');
	const token = authHeader.split(' ')[1]; // # The token is in the format "Bearer <token>", we want to extract the actual token

	console.log(`[tokenRequired] Token extracted: ${token}`);

	try {
		// Call the ZITADEL introspection endpoint to validate the token
		const introspectionRes = await axios.post(
			process.env.ZITADEL_INTROSPECTION_URL!,
			new URLSearchParams({ token }),
			{
				auth: {
					username: process.env.API_CLIENT_ID!,
					password: process.env.API_CLIENT_SECRET!,
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		); // TODO capire se funziona questa cosa

		console.log('[tokenRequired] Token introspection response:', introspectionRes.data);

		// Check if the token is active
		if (!introspectionRes.data.active) {
			return res.status(403).json({ message: 'Invalid token' });
		}

		console.log('[tokenRequired] Token is valid, decoding user information...');

		// decede the token to extract user information
		const decoded = jwt.decode(token, { json: true });
		if (!decoded) return res.status(403).json({ message: 'Token decoding failed' });

		console.log('[tokenRequired] User information decoded:', decoded);

		(req as any).user = decoded; // Attach to request object
		
		console.log('[tokenRequired] User information attached to request object:', (req as any).user);
		next();
	} catch (error) {
		return res.status(500).json({ message: 'Token introspection failed', error });
	}
};
