import {Resend} from "resend";
import {ENV} from "./env.js";

export const resendClient = new Resend(ENV.RESEND_API_KEY);

let sender = {};
if (ENV.NODE_ENV === 'development') {
    sender = {
        email: ENV.EMAIL_FROM,
        name: ENV.EMAIL_FROM_NAME
    };
} else {
    sender = {
        email: ENV.EMAIL_FROM_PROD,
        name: ENV.EMAIL_FROM_NAME
    };
}

export { sender };