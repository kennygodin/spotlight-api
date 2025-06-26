"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = require("@clerk/express");
const post_controller_1 = require("../controllers/post.controller");
const router = (0, express_1.Router)();
router.post('/create', (0, express_2.requireAuth)(), (req, res, next) => {
    console.log('CREATE POST ENDPOINT HIT');
    next();
}, post_controller_1.createPost);
router.get('/my-posts', (0, express_2.requireAuth)(), (req, res, next) => {
    console.log('MY POSTS ENDPOINT HIT');
    next();
}, post_controller_1.getLoggedInUserPosts);
router.get('/feed-posts', (0, express_2.requireAuth)(), (req, res, next) => {
    console.log('FEED POST ENDPOINT HIT');
    next();
}, post_controller_1.getFeedPosts);
exports.default = router;
