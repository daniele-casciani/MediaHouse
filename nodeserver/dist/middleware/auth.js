"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenRequired = void 0;
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenRequired = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: 'Missing Authorization header' });
    const token = authHeader.split(' ')[1];
    try {
        const introspectionRes = yield axios_1.default.post(process.env.ZITADEL_INTROSPECTION_URL, new URLSearchParams({ token }), {
            auth: {
                username: process.env.API_CLIENT_ID,
                password: process.env.API_CLIENT_SECRET,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        if (!introspectionRes.data.active) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        const decoded = jsonwebtoken_1.default.decode(token, { json: true });
        if (!decoded)
            return res.status(403).json({ message: 'Token decoding failed' });
        req.user = decoded; // Attach to request object
        next();
    }
    catch (error) {
        return res.status(500).json({ message: 'Token introspection failed', error });
    }
});
exports.tokenRequired = tokenRequired;
