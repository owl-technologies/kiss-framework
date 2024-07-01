import { isConstructor } from "../../utils/is-constructor.js";
import { ConstructorOrFunction, OpLink } from "../decorators/types.js";


export class JSONLink<To> implements OpLink<To, any> {

    constructor(public link : any, public transform?: ConstructorOrFunction<To>) {
        this.transform ??= (data: any) => String(data) as To;
     }

    set(link): void {
        this.link = link;
    }

    private _cachedValue: To;

    get(): To {
        if (!this._cachedValue) {
            try {
                if (isConstructor(this.transform)) {
                    this._cachedValue = new (this.transform as any)(this.link);
                } else {
                    this._cachedValue = (this.transform as Function)(this.link);
                }
            } catch (e : any) {
                throw new Error(`Error initializing link with value ${ JSON.stringify(this.link, null,2)} - ${e.message}`)
            }
        }
        return this._cachedValue;
    }

    toJSON() {
        return this.link;
    }
}