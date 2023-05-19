import { default as express, Application, Request, Response } from 'express';
import { JSONCodec, Codec, Msg } from 'nats';
import { PORT, SUBJECT } from './common/constants.ts';
import { natsConnection } from './common/connection.ts';



// create the express application (this is the server)
const app: Application = express();

// create a jsonCodec instance for decoding bytes returned from the subject into JSON
const jsonCodec : Codec<unknown> = JSONCodec();

// create an async get request function that takes "symbol" as a query parameter
app.get('/stock-info', async (request: Request, response: Response): Promise<void> => {
    
    // validate that a symbol is supplied prior to submitting a request to Nats
    if (request.query && request.query.symbol) {
        
        // force "symbol" to be a string (as query parameters can be multiple types beyond string)
        const symbol : string = request.query.symbol as string;
        
        // async call to helper method "request"
        natsConnection.request(SUBJECT,Buffer.from(symbol), {
            // we want to timeout after 2.5s
            timeout : 2500
        }).then((reply : Msg)=> {
            // decode natsResponse and return output to the callee
            response.send(jsonCodec.decode(reply.data));
        }).catch((reason)=> {
            if (reason.code && reason.code == 503) {
                // Nats returns a 503 if a subject is unavialble or does not have any subscribers
                response.send({error:`The Nats Subject "${SUBJECT}" is unavailable or does not have any subscribers attached.`});
            } else {
                // send raw error if other than 503, this can be expanded to catch other codes as well
                response.send ({"error" : reason}); 
            }
        })
        
        
    } else {
        response.send({"error" : `A stock symbol must be supplied as the query parameter 'symbol'.`}) 
    }
});

app.listen(PORT, (): void => {
    console.log(`Express Server is listening on port: ${PORT}`);
});


