
import express from 'express';
import cors from 'cors';

import imageRoutes from './routes/image.routes.js';

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({ origin: '*' }));

console.log("Mounting image routes");
app.use('/api', imageRoutes);

export default app;
