import { Request, Response, NextFunction } from 'express';
import { Buffer } from 'buffer';

const experienceOrder = ['junior', 'intermediate', 'senior'];

const accessRequirements: Record<string, { role: string; experience_level: string }[]> = {
	write_article: [
		{ role: 'journalist', experience_level: 'junior' },
		{ role: 'journalist', experience_level: 'intermediate' },
		{ role: 'journalist', experience_level: 'senior' }
	],
	edit_article: [
		{ role: 'editor', experience_level: 'junior' },
		{ role: 'editor', experience_level: 'intermediate' },
		{ role: 'editor', experience_level: 'senior' }
	],
	review_article: [
		{ role: 'journalist', experience_level: 'senior' },
		{ role: 'editor', experience_level: 'intermediate' },
		{ role: 'editor', experience_level: 'senior' }
	],
	publish_article: [
		{ role: 'journalist', experience_level: 'intermediate' },
		{ role: 'journalist', experience_level: 'senior' },
		{ role: 'editor', experience_level: 'senior' }
	]
};

// Middleware to authorize access based on user role and experience level
export const authorizeAccess = (endpoint: string) => {
	console.log(`[authorizeAccess] Authorizing access for endpoint: ${endpoint}`);
	return (req: Request, res: Response, next: NextFunction) => {
		// We assume that the token has already been decoded in auth.ts
		const token = (req as any).user;
		console.log(`[authorizeAccess] Token found:`, token);
		// init the role and experience level variables
		let role: string | undefined;
		let experienceLevel: string | undefined;

		// Check if the token contains the required claims
		for (const [claim, value] of Object.entries(token)) {
			if (claim.endsWith(':experience_level')) {
				role = claim.split(':')[0];
				experienceLevel = Buffer.from(value as string, 'base64').toString('utf-8');
				break;
			}
		}
		console.log(`[authorizeAccess] Role: ${role}, Experience Level: ${experienceLevel}`);

		// If role or experience level is not found, deny access
		if (!role) return res.status(403).json({ message: 'Missing role' });
		
		// If experience level is not found, default to 'junior'
		if (!experienceLevel) experienceLevel = 'junior';

		// Check if the endpoint exists in access requirements
		const allowed = accessRequirements[endpoint]?.some((req) => {
			return (
				req.role === role &&
				experienceOrder.indexOf(experienceLevel!) >= experienceOrder.indexOf(req.experience_level)
			);
		});

		// If the user does not meet the access requirements, deny access
		if (!allowed) {
			return res.status(403).json({
				message: `Access denied! You are a ${experienceLevel} ${role} and cannot access ${endpoint}`
			});
		}

		next();
	};
};
