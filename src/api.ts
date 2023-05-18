import express, { Application, Request, Response } from 'express';
import { connect, NatsConnection, StringCodec, JSONCodec, Codec } from 'nats';
import { NATS_SERVER, PORT, SUBJECT } from './common/constants';


(async ()=>{
    // create the express application (this is the server)
    const app: Application = express();

    // establish a connection to the Nats server
    const natsConnection : NatsConnection = await connect({servers:NATS_SERVER});

    // create a jsonCodec instance for decoding bytes returned from the subject into JSON
    const jsonCodec : Codec<unknown> = JSONCodec();

    // create an async get request function that takes "symbol" as a query parameter
    app.get('/stock-info', async (request: Request, response: Response): Promise<void> => {
        
        // validate that a symbol is supplied prior to submitting a request to Nats
        if (request.query && request.query.symbol) {
            
            // force "symbol" to be a string (as query parameters can be multiple types beyond string)
            const symbol : string = request.query.symbol as string;
            
            // async call to helper method "request"
            const natsResponse = await natsConnection.request(SUBJECT,Buffer.from(symbol), {
                // we want to timeout after 2.5s
                timeout : 2500
            });
            
            // decode natsResponse and return output to the callee
            response.send(jsonCodec.decode(natsResponse.data));
        } else {
            response.send({"error" : `A stock symbol must be supplied as the query parameter 'symbol'.`}) 
        }
    });
    
    app.listen(PORT, (): void => {
        console.log(`Express Server is listening on port: ${PORT}`);
    });

    process.on("SIGINT",()=>{
        natsConnection.close();
        console.log("Connection Closed.");
    });

})();
