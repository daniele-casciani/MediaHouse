import { Request, Response, NextFunction } from 'express';
import jwt, { JwtHeader } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
	jwksUri: 'http://zitadel:8080/oauth/v2/keys', // DNS interno al container
	cache: true,
	rateLimit: true,
});

const getKey = (header: JwtHeader, callback: (err: Error | null, key?: string) => void) => {
	if (!header.kid) {
		return callback(new Error('Missing "kid" in token header'));
	}
	client.getSigningKey(header.kid, (err, key) => {
		if (err) return callback(err);
		if (!key) return callback(new Error('Signing key not found'));
		const signingKey = key.getPublicKey();
		callback(null, signingKey);
	});
};
console.log('[auth.ts] JWT public key client initialized');

export const tokenRequired = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	console.log('[tokenRequired] Authorization header:', authHeader);

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Missing or invalid Authorization header' });
	}

	const token = authHeader.split(' ')[1];
	console.log('[tokenRequired] Token estratto:', token);

	jwt.verify(token, getKey, {
			algorithms: ['RS256'],
			issuer: 'http://localhost:8082', // 👈 preso da "iss"
			audience: '329109181506322437', // 👈 uno dei valori in "aud" (es. il tuo client_id)
		}, (err, decoded) => {
			if (err) {
				console.error('[tokenRequired] JWT verification failed:', err);
				return res.status(403).json({ message: 'Invalid or expired token' });
			}
			if (!decoded || typeof decoded !== 'object') {
				return res.status(403).json({ message: 'Invalid token structure' });
			}

			console.log('[tokenRequired] Token valido. Issuer:', decoded.iss);
			console.log('[tokenRequired] Ruoles:', decoded['urn:zitadel:iam:org:project:roles']);
			(req as any).user = decoded;
			next();
		});
};
