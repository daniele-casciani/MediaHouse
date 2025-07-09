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

export const authorizeAccess = (endpoint: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = (req as any).user;
    let role: string | undefined;
    let experienceLevel: string | undefined;

    for (const [claim, value] of Object.entries(token)) {
      if (claim.endsWith(':experience_level')) {
        role = claim.split(':')[0];
        experienceLevel = Buffer.from(value as string, 'base64').toString('utf-8');
        break;
      }
    }

    if (!role) return res.status(403).json({ message: 'Missing role' });
    if (!experienceLevel) experienceLevel = 'junior';

    const allowed = accessRequirements[endpoint]?.some((req) => {
      return (
        req.role === role &&
        experienceOrder.indexOf(experienceLevel!) >= experienceOrder.indexOf(req.experience_level)
      );
    });

    if (!allowed) {
      return res.status(403).json({
        message: `Access denied! You are a ${experienceLevel} ${role} and cannot access ${endpoint}`
      });
    }

    next();
  };
};
