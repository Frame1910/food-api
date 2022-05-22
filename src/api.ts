import express from "express";
import foodRepository from "./food";

const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get( "/", (req, res) => {
    res.send( "Hello world!" );
} );

app.get("/search?", async (req, res) => {
    const foods = await foodRepository.search().return.all()
    res.send(foods);
})

// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );