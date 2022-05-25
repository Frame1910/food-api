import express, { Request, Response } from 'express';
import cors from 'cors';
import connect from '.';


export const app = express();

app.use( express.json() )

app.use( cors({ origin: true }) )

app.get('/ping', (req: Request, res: Response) => {
    res.status(200).send('Pong');
})

app.get('/search?', async (req: Request, res: Response) => {
    const client = await connect();
    let foods = await client.ft.search('Food:index', req.query['term'].toString(), {
        RETURN: ['class_name', 'food_name', 'food_desc', 'entry_type', 'public_food_key'],
        SUMMARIZE: {
            FIELDS: ['food_desc', 'class_name'],
            FRAGS: 1,
            LEN: 10,
        }
        HIGHLIGHT: {
            TAGS: {
                open: '<b>',
                close: '</b>'
            }
        },
    })
    let score: Array<any> = await client.sendCommand(['FT.SEARCH', 'Food:index', req.query['term'].toString(), 'RETURN', '1', 'public_food_key', 'WITHSCORES', 'NOCONTENT'])
    score.forEach((element, index, self) => {
        if (index > 0) {
           
            if (index % 2 !== 0) {
                let foodId = element;
                let matchingIndex = foods.documents.findIndex(doc => doc.id == foodId);
                if (matchingIndex > -1){
                    foods.documents[matchingIndex]['score'] = parseInt(self[index+1]);
                }
            }

        }
    })
    foods.documents.sort((a, b) => b['score'] - a['score']);
    res.status(200).send(foods);
    await client.disconnect();
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