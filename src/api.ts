import express, { Request, Response } from 'express';
import cors from 'cors';
import connect from '.';


export const app = express();

app.use( express.json() )

app.use( cors({ origin: true }) )

app.get('/test?', (req: Request, res: Response) => {
    res.status(200).send(`Message: ${req.query['msg']}`);
})

app.get('/search?', async (req: Request, res: Response) => {
    const client = await connect();
    let foods = await client.ft.search('Food:index', req.query['term'].toString(), {
        RETURN: ['food_name', 'food_desc'],
        HIGHLIGHT: {
            TAGS: {
                open: '<b>',
                close: '</b>'
            }
        }
    })
    res.send(foods);
    await client.disconnect();
})