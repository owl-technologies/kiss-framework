import { assert } from "../../utils/assert.js";
import { ConstructorOrFunction, GatewayFn, OpLink } from "../decorators/types.js";


export class CidLink<To> implements OpLink<To, any> {

    static accessor IPFS_GATEWAY = 'https://ipfs.oplanto.com'

    static accessor ipfsGateway : GatewayFn;

    cache: Promise<To>;

    get link() {
        return `${CidLink.IPFS_GATEWAY}/ipfs/${this.cid}`;
    }

    constructor(
        public cid: string, 
        public transform?: ConstructorOrFunction<To>, 
        public responseType: 'arraybuffer' | 'json' = 'json'
    ) {
        //TODO: Validate cid format
        assert(typeof cid === 'string', `Cid is not a string: ${JSON.stringify(cid)} ${typeof cid}`);
        assert(cid.length >= 46 && cid.length <= 62, `Invalid cid: ${cid}`);
    }

    set(value: To): void {
        throw new Error("Method not implemented.");
    }

    get(): Promise<To> {
        assert(CidLink.ipfsGateway, `CidLink.ipfsGateway is not set`);
        if (!this.cache) {
            this.cache = CidLink.ipfsGateway<To>(this.cid, this.transform, this.responseType);
        }
        return this.cache;
    }

    toJSON() {
        // console.log(`Serializing CidLink ${JSON.stringify(this.cid,null,2)}`);
        return this.cid;
    }
}