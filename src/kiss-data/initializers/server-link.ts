import { assert } from "../../utils/assert.js";
import { ConstructorOrFunction, GatewayFn, OpLink } from "../decorators/types.js";




export class OpServerLink<To> implements OpLink<To, any> {

    static accessor SEARCH_GATEWAY = 'https://development.oplanto.com:3000/';

    static accessor searchGateway : GatewayFn;

    cache: Promise<To>;

    get link() {
        return  OpServerLink.SEARCH_GATEWAY + this.prefix + this.id;
    }

    constructor(
        public id: string, 
        public prefix: string,
        public transform?: ConstructorOrFunction<To>
    ) {
        assert(typeof id === 'string', `Id is not a string: ${JSON.stringify(id)} ${typeof id}`);
        assert(typeof prefix === 'string', `Prefix is not a string: ${JSON.stringify(prefix)} ${typeof prefix}`);
        assert(id.length > 0 && id.length <= 64, `Invalid id: ${id}`);
    }

    set(value: To): void {
        throw new Error("Method not implemented.");
    }

    get(): Promise<To> {
        assert(OpServerLink.searchGateway, `OpServerLink.searchGateway is not set`);
        if (!this.cache) {
            this.cache = OpServerLink.searchGateway<To>(this.link, this.transform, 'json');
        }
        return this.cache;
    }

    toJSON() {
        return this.id;
    }
}