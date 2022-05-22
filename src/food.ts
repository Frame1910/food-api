import { Entity, Schema } from 'redis-om'
import client from './client'

class Food extends Entity {}

const foodSchema = new Schema(Food, {
    food_name: { type: 'string' },
    food_description: { type: 'string' },
    energy_with_dietary_fibre_equated_kj: { type: 'string' }
})

const foodRepository = client.fetchRepository(foodSchema);

export default foodRepository