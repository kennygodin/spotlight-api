"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("@upstash/redis");
const ratelimit_1 = require("@upstash/ratelimit");
require("dotenv/config");
const ratelimit = new ratelimit_1.Ratelimit({
    redis: redis_1.Redis.fromEnv(),
    limiter: ratelimit_1.Ratelimit.slidingWindow(100, '60 s'),
});
exports.default = ratelimit;
