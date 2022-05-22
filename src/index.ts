import { config } from "dotenv";

if (process.env.NODE_ENV !== 'production') {
    config();
}


// Init Redis OM
import { Client } from 'redis-om';
const url = process.env.REDIS_URL;
const client = async () => {
    return await new Client().open(url)
}
export default client;