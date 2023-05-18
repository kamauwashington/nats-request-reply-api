export const SUBJECT : string = process.env.SUBJECT || "stock.request";
export const NATS_SERVER : string = process.env.NATS_SERVER || "localhost";
export const PORT : number = parseInt(process.env.PORT || "3000");
export const ALPHA_VANTAGE_KEY : string = process.env.ALPHA_VANTAGE_KEY || "no-key";