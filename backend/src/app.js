import express  from 'express';
import usersRoutes from './routes/users.routes.js';
import categoriesRoutes from './routes/categories.routes.js'



const app = express();

app.use(express.json());

app.use('/api', usersRoutes);
app.use('/api', categoriesRoutes);

export default app;
