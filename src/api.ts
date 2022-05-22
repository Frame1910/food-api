import express, { Request, Response } from 'express';
export const app = express();

app.use( express.json() )

import cors from 'cors';
app.use( cors({ origin: true }) )

app.get('/test?', (req: Request, res: Response) => {
    res.status(200).send(`Message: ${req.query['msg']}`);
})