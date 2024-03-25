// import { version } from '../../package.json';
import { metadata } from "../utils/reflect-metadata.js";


// export const CURRENT_VERSION = Number(version);

export const CURRENT_VERSION = 0.2;

export function RegisterMigrate<This extends KissData, F extends (this: This, from: any) => any>(method: F, context: ClassMethodDecoratorContext<This, F>) {
  // console.debug(`++++++ RegisterMigrate ${String(context.name)} ${method}`)
  const m = metadata.setFunction<F>(context, MIGRATE_METADATA, method);
  // return function (this: This, ...args: any) {
  //   return m.call(this, args);
  // }
}

export const FIELD_METADATA = Symbol('FieldMetadata');

export const MIGRATE_METADATA = Symbol('MigrateMetadata');

/**
 * initialized - uninitialized fields are initialized by decorators in 
 * the inherited classes, mostly by @InitJson
 * 
 * required - @Required fields are checked for existence when creating 
 * a new object from JSON. If the field is not set, an error is thrown.
 * @Required fields are serialized to JSON
 * 
 * optional - optional fields are not checked for existence when creating
 * a new object from JSON. If the field is not set, it is ignored. @Optional
 * fields are serialized to JSON
 */

export type FIELD_PROPERTIES = {
  initialized?: boolean,
  required?: boolean,
  optional?: boolean
}

export abstract class KissData<T = any> {

  /**  
   * This is a version of the format. It is used to determine if the 
   * format is compatible with the current version of the software.
   * When the format is different from the current version, the migrate()
   * method decorated with @RegisterMigrate is called to migrate the data 
   * to the current version.
   */
  "protocol-version": number;

  /**
   * Metadata for the fields of the class. The fields initialized, required 
   * or optional are used to initialize the fields of the class, and to
   * determine if the field is required or optional when serializing to JSON.
   */
  [FIELD_METADATA] = new Map<string | symbol, FIELD_PROPERTIES>();

  constructor(public from: any) {
    // console.debug(`OplantoFormat constructor ${this.constructor.name}, from ${JSON.stringify(from)}`)
    if (from) {
      if (from['protocol-version'] !== CURRENT_VERSION) {
        // try to migrate the data to the current version
        const migrate = metadata.getFunction(this, MIGRATE_METADATA);
        if (!migrate) {
          throw new Error(`metadata not defined for ${this.constructor?.name}`)
        } else {
          from = migrate(from);
        }
        // if the data is not migrated, throw an error
        if (!from || from['protocol-version'] !== CURRENT_VERSION) {
          throw new Error(`Protocol version ${from ?? from['protocol-version']} is not supported by ${this.constructor?.name}`);
        }
      }
      this['protocol-version'] = from['protocol-version'];
      this[FIELD_METADATA].set('protocol-version', { initialized: true, required: true });
      // console.debug(`returning after Constructor ${this.constructor.name}`)
    }
  }

  /**
   * Serializes the object to JSON. It uses the metadata to determine if the field 
   * is required or optional.Only required and optional fields are serialized. 
   * If the field is required and not set, an error is thrown.
   */
  toJSON(): any {
    const keys = Object.keys(this);
    const sortedKeys = keys.filter(key => key !== 'link').sort();

    const fieldsMeta = this[FIELD_METADATA] as Map<string | symbol, FIELD_PROPERTIES>;
    if (fieldsMeta?.size > 0) {
      return sortedKeys.reduce((obj, key) => {
        if (!fieldsMeta.has(key)) {
          // console.warn(`Property ${key} not required in class ${this.constructor.name}, ignoring it`);
          return obj;
        } else {
          // If the property is required, try to get it from the accessor or the field
          let fieldMeta = fieldsMeta.get(key) as FIELD_PROPERTIES;
          switch (true) {
            // If there is no field Metadata, ignore the property
            case fieldMeta === undefined:
            // If the property is not required, nor optional, ignore it
            case !fieldMeta.required && !fieldMeta.optional:
            // If the property is optional and not set, ignore it
            case fieldMeta?.optional && this[key] === undefined:
              return obj;
            case fieldMeta?.required && this[key] === undefined:
              throw new Error(`Required field ${this.constructor?.name}.${String(key)} is not set, cannot serialize`);
            // If the property has a toJSON method, call it
            case this[key]?.toJSON && this[key]?.toJSON instanceof Function:
              // console.debug(`Serializing field toJSON ${this.constructor.name}.${key}`);
              obj[key] = this[key].toJSON();
              return obj;
            // If the property is any other type, just assign it
            default:
              // console.debug(`Serializing field toString() ${this.constructor.name}.${key}`);
              obj[key] = this[key];
              return obj;
          }
        }
      }, {});
    } else {
      return {}
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
   *       throw new Error(`Unsupported protocol version ${this.link['protocol-version']} for ${this.constructor.name}`);
   *   }
   * }
   */
  @RegisterMigrate
  migrate<T>(from: T): T {
    throw Error(`Migrating ${this.constructor?.name} from ${from['protocol-version']} to ${CURRENT_VERSION} is not implemented`)
  }
}
