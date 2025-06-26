"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("@clerk/express");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const rateLimiter_1 = __importDefault(require("./middlewares/rateLimiter"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const item_route_1 = __importDefault(require("./routes/item.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const webhook_route_1 = __importDefault(require("./routes/webhook.route"));
const upload_route_1 = __importDefault(require("./routes/upload.route"));
const app = (0, express_1.default)();
app.use('/api', webhook_route_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_2.clerkMiddleware)());
app.use(rateLimiter_1.default);
app.use((0, express_fileupload_1.default)({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));
// Routes
app.use('/api/items', item_route_1.default);
app.use('/api/posts', post_route_1.default);
app.use('/api/uploads', upload_route_1.default);
app.use('/api/users', user_route_1.default);
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Healthy' });
});
app.get('/api/protected', (0, express_2.requireAuth)(), (req, res) => {
    const auth = req.auth();
    const userId = auth?.userId;
    res.json({
        message: 'This is a protected route',
        userId: userId,
    });
});
app.use(errorHandler_1.default);
exports.default = app;
