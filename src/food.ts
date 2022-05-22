import {Entity, Schema } from 'redis-om';

class Food extends Entity {}

export const foodSchema = new Schema(Food, {
    public_food_key: { type: 'text' },
    food_profile_id: { type: 'text' },
    derivation: { type: 'text' },
    food_name: { type: 'text' },
    food_description: { type: 'text' }

})

