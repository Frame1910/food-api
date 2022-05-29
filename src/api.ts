import express, { Request, Response } from 'express';
import cors from 'cors';
import connect from '.';
import RedisService from './RedisService';


export const app = express();

app.use( express.json() )

app.use( cors({ origin: true }) )

app.get('/ping', (req: Request, res: Response) => {
    res.status(200).send('Pong');
})

app.get('/search?', async (req: Request, res: Response) => {
    let foods = RedisService.fullTextFoodSearch(req.query['term'].toString());
    res.status(200).send(foods);
    
})

app.get('/:index', async (req: Request, res: Response) => {
    const client = await connect();
    let food = await client.json.get(req.params['index']);
    res.status(200).send(food)
})

app.get('/nutrient/:food_key', async (req: Request, res: Response) => {
    const client = await connect();
    let nutrient = await client.ft.search('Nutrient:index', req.params['food_key']);
    res.status(200).send(nutrient);
})