// import { version } from '../../package.json';
import { metadata } from "../utils/reflect-metadata.js";
import { FIELD_METADATA, KissSerializableData } from "./kiss-serializable-data.js";


export function RegisterMigrate<This extends KissSerializableData, F extends (this: This, from: any) => any>(method: F, context: ClassMethodDecoratorContext<This, F>) {
    // console.debug(`++++++ RegisterMigrate ${String(context.name)} ${method}`)
    const m = metadata.setFunction<F>(context, MIGRATE_METADATA, method);
    // return function (this: This, ...args: any) {
    //   return m.call(this, args);
    // }
}

export const MIGRATE_METADATA = Symbol('MigrateMetadata');


export abstract class KissUpgradableData<T = any> extends KissSerializableData {

    static CURRENT_VERSION = 0.01;

    /**  
     * This is a version of the format. It is used to determine if the 
     * format is compatible with the current version of the software.
     * When the format is different from the current version, the migrate()
     * method decorated with @RegisterMigrate is called to migrate the data 
     * to the current version.
     */
    "protocol-version": number;

    original;

    constructor(src) {
        let original, transform;
        if (src) { // See if it is possible/necessary to migrate the data
            // try to parse protocol-version to number, convert to number only if it is there
            if (typeof src['protocol-version'] === 'string') {
                src['protocol-version'] = parseFloat(src['protocol-version']);
            }
            // if protocol-version is below, pass a transform function to the KissSerializableData
            // that will transform the src before running class decorators that initialize the fields
            if (src['protocol-version'] < KissUpgradableData.CURRENT_VERSION) {
                original = { ...src }; //Shallow copy of src
                transform =  (src) => {
                    // try to migrate the data to the current version
                    const migrate = metadata.getFunction(this, MIGRATE_METADATA);

                    if (!migrate) {
                        throw new Error(`metadata not defined for ${ this.constructor?.name}`)
                    } else {
                        //migrate shallow copy the src object
                        src = migrate({ ...src });
                    }
                }
            }
        }
        super(src, transform)
        // after transform was executed we can use this accessor to store KissUpgradableData fields
        if (transform) {
            this.original = original;
            this['protocol-version'] ??= this.src['protocol-version']
            this[FIELD_METADATA].set('protocol-version', { initialized: true, required: true });
        }
        // if the data is not upgraded, throw an error
        if (!src || src['protocol-version'] !== KissUpgradableData.CURRENT_VERSION) {
            throw new Error(`Unsupported protocol version: ${JSON.stringify(this.original)}`);
        }
    }

    /**
     * Migrates the data from the current version to the latest version. It is executed by OplantoFormat constructor,
     * after the link is set, therefor nothing but the link should be used in this method. This method must transform
     * the data in the link to the latest version. e.g.:
     *   @RegisterMigrate
     * migrate (from: any) {
     *   switch (from['protocol-version']) {
     *     case undefined:
     *       throw new Error(`Protocol version is not defined in ${this.link}`)
     *     case 0.1:
     *       // Conversions from this.link 0.1 to 0.2 go here
     *       from['protocol-version'] = 0.2;
     *       return from;
     *     default:
     *       throw new Error(`Unsupported protocol version ${this.link['protocol-version']} for ${this.constructor?.name}`);
     *   }
     * }
     */
    @RegisterMigrate
    migrate<T>(from: T): T {
        throw Error(`Migrating ${this?.constructor?.name} from ${from['protocol-version']} to ${KissUpgradableData.CURRENT_VERSION} is not implemented`)
    }
}
