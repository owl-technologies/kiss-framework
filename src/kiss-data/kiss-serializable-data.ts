// import { version } from '../../package.json';
import { allKeys } from "../utils/allKeys.js";


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

export abstract class KissSerializableData<T = any> {

  /**
   * Metadata for the fields of the class. The fields initialized, required 
   * or optional are used to initialize the fields of the class, and to
   * determine if the field is required or optional when serializing to JSON.
   */
  [FIELD_METADATA] = new Map<string | symbol, FIELD_PROPERTIES>();

  constructor(public src, transform?: Function) {
    if (transform) {
      this.src = transform(this, src)
    }
  }


  /**
   * Serializes the object to JSON. It uses the metadata to determine if the field 
   * is required or optional.Only required and optional fields are serialized. 
   * If the field is required and not set, an error is thrown.
   */
  toJSON(): any {
    const keys = allKeys(this).filter(key => typeof key === 'string').sort()
    // const sortedKeys = keys.sort();
    const fieldsMeta = this[FIELD_METADATA] as Map<string | symbol, FIELD_PROPERTIES>;
    if (fieldsMeta?.size > 0) {
      const newObj = keys.reduce((obj, key) => {
        if (!fieldsMeta.has(key)) {
          // console.warn(`Property ${key} is not required to be serialized in class ${this.constructor?.name}, ignoring it`);
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
            // If the property is an array, call toJSON on each element
            case this[key] instanceof Array:
              obj[key] = this[key].map((element: any) => element?.toJSON ? element.toJSON() : element);
              return obj;
            // If the property has a toJSON method, call it
            case this[key]?.toJSON && this[key]?.toJSON instanceof Function:
              obj[key] = this[key].toJSON();
              return obj;
            // If the property is any other type, just assign it
            default:
              obj[key] = this[key];
              return obj;
          }
        }
      }, {});
      return newObj;
    } else {
      return {}
    }
  }
}
