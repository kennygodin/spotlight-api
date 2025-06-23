import app from './app';
import config from './config/config';
import dotenv from 'dotenv';
import job from './config/cron';

dotenv.config();

if (process.env.NODE_ENV === 'production') job.start();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
