import { config } from "dotenv";

if (process.env.NODE_ENV !== 'production') {
    config();
}


// Init Redis OM
import { Client } from 'redis-om';
const connect = async () => {
    const url = process.env.REDIS_URL;
    return await new Client().open(url);
}
export default connect;


// Init app
import { app } from "./api";
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API available on http://localhost:${port}`))