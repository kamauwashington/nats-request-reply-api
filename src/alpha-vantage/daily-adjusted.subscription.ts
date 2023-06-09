import { JSONCodec, Codec, NatsError, Msg } from 'nats';
import { SUBJECT, ALPHA_VANTAGE_KEY } from '../common/constants.ts'
import axios from 'axios';
import { TextDecoder } from 'util';
import { natsConnection } from '../common/connection.ts';

// create a jsonCodec instance for decoding bytes returned from the subject into JSON
const jsonCodec : Codec<unknown> = JSONCodec();

// create a TextDecoder to read byte data returned from the published data
const textDecoder : TextDecoder = new TextDecoder();

natsConnection.subscribe(SUBJECT,{
    
    // NOT TRAPPING ERRORS FOR BREVITY (this should be simple enough to implement from this starting point)
    callback : async (err : NatsError | null, msg : Msg) => {

        // decode the symbol for use in the following query
        const symbol : string = textDecoder.decode(msg.data);

        // call Alpha Vantage Rest APIs : TIME_SERIES_DAILY_ADJUSTED (https://www.alphavantage.co/documentation/#dailyadj)
        const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`)
        msg.respond(jsonCodec.encode(response.data));
    }
})

