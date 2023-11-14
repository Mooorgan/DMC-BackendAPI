import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { taskRoutes } from './routes/task.routes';
import { userRoutes } from './routes/user.routes';
import { get404, get500 } from './controllers/error.controller';

dotenv.config({ path: './config.env' });

const db = (process.env.DATABASE as string).replace(
  '<PASSWORD>',
  process.env.MONGO_DB_CONNECTION_STRING!
);

mongoose
  .connect(db)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.log('Connection failed');
  });

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PATCH,PUT,DELETE,OPTIONS'
  );
  next();
});

app.use(express.json());

app.use('/api/task', taskRoutes);
app.use('/api/user', userRoutes);
app.use(get404);
app.use(get500);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
