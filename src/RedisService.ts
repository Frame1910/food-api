import connect from ".";
import { FoodSearch, RedisResponse } from "./models";

export default abstract class RedisService {

    public static async fullTextFoodSearch(term: string): RedisResponse<FoodSearch> {
        const client = await connect();
        let foods = await client.ft.search('Food:index', term, {
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
        let score: Array<any> = await client.sendCommand(['FT.SEARCH', 'Food:index', term, 'RETURN', '1', 'public_food_key', 'WITHSCORES', 'NOCONTENT'])
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
        await client.disconnect();
        return foods as unknown as RedisResponse<FoodSearch>;
    }
}