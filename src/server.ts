import express from 'express';
import config from './config';
import initDB from './config/db';

const app = express();

const port = config.port;

app.use(express.json());

initDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
