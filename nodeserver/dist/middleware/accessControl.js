"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAccess = void 0;
const buffer_1 = require("buffer");
const experienceOrder = ['junior', 'intermediate', 'senior'];
const accessRequirements = {
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
const authorizeAccess = (endpoint) => {
    return (req, res, next) => {
        var _a;
        const token = req.user;
        let role;
        let experienceLevel;
        for (const [claim, value] of Object.entries(token)) {
            if (claim.endsWith(':experience_level')) {
                role = claim.split(':')[0];
                experienceLevel = buffer_1.Buffer.from(value, 'base64').toString('utf-8');
                break;
            }
        }
        if (!role)
            return res.status(403).json({ message: 'Missing role' });
        if (!experienceLevel)
            experienceLevel = 'junior';
        const allowed = (_a = accessRequirements[endpoint]) === null || _a === void 0 ? void 0 : _a.some((req) => {
            return (req.role === role &&
                experienceOrder.indexOf(experienceLevel) >= experienceOrder.indexOf(req.experience_level));
        });
        if (!allowed) {
            return res.status(403).json({
                message: `Access denied! You are a ${experienceLevel} ${role} and cannot access ${endpoint}`
            });
        }
        next();
    };
};
exports.authorizeAccess = authorizeAccess;
