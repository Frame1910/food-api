import { config } from "dotenv";
import { Client } from 'redis-om'

if (process.env.NODE_ENV !== 'production') {
    config();
}

/* pulls the Redis URL from .env */
const url = process.env.REDIS_URL

/* create and open the Redis OM Client */
export const client = await new Client().open(url)

export default client