import { config } from "dotenv";
import { createClient } from "redis";

if (process.env.NODE_ENV !== 'production') {
    config();
}


// Init Redis OM

const connect = async () => {
    const url = process.env.REDIS_URL;
    const client = createClient({
        url: url,
    });
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect()
    return client;
}
export default connect;


// Init app
import { app } from "./api";
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API available on http://localhost:${port}`))