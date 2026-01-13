
import express from 'express';
import cors from 'cors';

import imageRoutes from './routes/image.routes.js';

const app = express();

app.use(express.json());
app.use(cors());

console.log("Mounting image routes");
app.use('/api', imageRoutes);

export default app;
