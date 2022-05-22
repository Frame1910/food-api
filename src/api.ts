import express, { Request, Response } from 'express';
import cors from 'cors';
import connect from '.';
import { foodSchema } from './food';


export const app = express();

app.use( express.json() )

app.use( cors({ origin: true }) )

app.get('/test?', (req: Request, res: Response) => {
    res.status(200).send(`Message: ${req.query['msg']}`);
})

app.get('/search?', async (req: Request, res: Response) => {
    const client = await connect();
    const foodRepo = client.fetchRepository(foodSchema);
    let foods = await foodRepo.searchRaw(req.query['term'].toString()).return.all();
    res.send(foods);
    await client.close();
})