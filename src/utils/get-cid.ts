import axios, { ResponseType } from "axios";
import { CidLink, Constructor, ConstructorOrFunction, isConstructor } from "../index.js";

/**
 * Gets cid and optionally transforms it into a class or uses a callback
 * function. Either transform or callback use response as input.
 *
 * @param cid the cid to get
 * @param transform either a class or a callback function
 * @returns
 */
export const getCid = async <T = any>(cid: string, transform?: ConstructorOrFunction<T>, responseType : ResponseType = 'json'): Promise<T> => {
    const url = `${CidLink.IPFS_GATEWAY}/ipfs/${cid}`;
    const response = await axios.get(url, { responseType });

    // console.debug(`getCid<${responseType}>(${cid})`);
    if (typeof transform === 'function') {
        if (isConstructor(transform)) {
            // It's a class
            return new (<Constructor<T>>transform)(response.data);
        } else {
            // It's a function
            return await (transform as (data: any) => T)(response.data);
        }
    }
    return response.data as T;
}