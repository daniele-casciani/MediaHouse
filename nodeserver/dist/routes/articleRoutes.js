"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const accessControl_1 = require("../middleware/accessControl");
const router = express_1.default.Router();
router.post('/write_article', auth_1.tokenRequired, (0, accessControl_1.authorizeAccess)('write_article'), (req, res) => {
    res.json({ message: 'Article written successfully!' });
});
router.put('/edit_article', auth_1.tokenRequired, (0, accessControl_1.authorizeAccess)('edit_article'), (req, res) => {
    res.json({ message: 'Article edited successfully!' });
});
router.get('/review_articles', auth_1.tokenRequired, (0, accessControl_1.authorizeAccess)('review_article'), (req, res) => {
    res.json({ message: 'Article review accessed successfully!' });
});
router.post('/publish_article', auth_1.tokenRequired, (0, accessControl_1.authorizeAccess)('publish_article'), (req, res) => {
    res.json({ message: 'Article published successfully!' });
});
exports.default = router;
