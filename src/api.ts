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
    let foods = await client.ft.search('Food:index', req.query['term'].toString() + '*', {
        RETURN: ['class_name', 'food_name', 'food_desc', 'entry_type', 'public_food_key'],
        HIGHLIGHT: {
            TAGS: {
                open: '<b>',
                close: '</b>'
            }
        },
    })
    let score: Array<any> = await client.sendCommand(['FT.SEARCH', 'Food:index', req.query['term'].toString() + '*', 'RETURN', '1', 'public_food_key', 'WITHSCORES', 'NOCONTENT'])
    score.forEach((element, index, self) => {
        if (index > 0) {
           
            if (index % 2 !== 0) {
                let foodId = element;
                let matchingIndex = foods.documents.findIndex(doc => doc.id == foodId);
                if (matchingIndex > -1){
                    foods.documents[matchingIndex]['score'] = parseInt(self[index+1]);
                    console.log(foods.documents[matchingIndex]);
                }
            }

        }
    })
    //foods.documents.sort((a, b) => b['score'] - a['score']);
    res.send(foods);
    await client.disconnect();
})