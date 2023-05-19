import { NatsConnection, connect } from "nats";
import { NATS_SERVER } from "./constants.ts";
 
let connection : NatsConnection;
try {
    // establish a connection to the Nats server
    connection = await connect({servers:NATS_SERVER});
    console.log(`Connection to Nats server "${NATS_SERVER}" established.`)
} catch (error) {
    // on connection error exit the process
    console.error(`A connection to the Nats server "${NATS_SERVER}" could not be established.`);
    process.exit(1);
}

export const natsConnection = connection;

// on process killed lets close the connection
process.on("SIGINT",()=>{
    // though the process will exit if a connection cannot be established, practice defensive programming
    if (natsConnection) {
        natsConnection.close();
    }
    console.log("\nNats Connection Closed.");

    // exit needs to be called as ExpressJS does not stop listening on SIGINT in all cases, keeping the process open
    process.exit(1);
});