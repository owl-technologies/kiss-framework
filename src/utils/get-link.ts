import axios, { ResponseType } from "axios";
import { Constructor, ConstructorOrFunction, OpServerLink } from "../index.js";

/**
 * Gets cid and optionally transforms it into a class or uses a callback
 * function. Either transform or callback use response as input.
 *
 * @param cid the cid to get
 * @param transform either a class or a callback function
 * @returns
 */
export const getLink = async <T = any>(link: string, transform?: ConstructorOrFunction<T>, responseType : ResponseType = 'json'): Promise<T> => {
    const response = await axios.get(link, { responseType });

    if (typeof transform === 'function') {
        if (transform.prototype && transform.prototype.constructor) {
        // if( isClass(transform) ){
            // It's a class
            return new (<Constructor<T>>transform)(response.data) as T;
        } else {
            // It's a function
            return (transform as (data: any) => T)(response.data);
        }
    }
    return response.data as T;
}

OpServerLink.searchGateway = getLink;


