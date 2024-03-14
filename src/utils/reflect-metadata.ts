import { Constructor } from "../kiss-data/decorators/types.js";
import { isClass } from "./is-class.js";
import { isConstructor } from "./is-constructor.js";

(Symbol['metadata'] as any) ??= Symbol('Symbol.metadata');

// export const INITIALIZERS = Symbol('RunAfterConstructorMetadata');

// export const INITIALIZED_FLAGS = Symbol('InitializedFlags');

// export const RUN_AFTER_INIT = Symbol('RunAfterConstructorMetadata');

// export const ACCESSOR_METADATA = Symbol('AccessorMetadata');

// export const SERIALIZE_METADATA = Symbol('SerializeMetadata');

export const metadata = {
    get<OfType>(
        contextOrClass: DecoratorContext | Constructor<OfType> | Object,
        field: string | symbol,
        init: OfType | (() => OfType) = undefined as any) {
        let meta: any;
        switch (true) {
            case (contextOrClass.hasOwnProperty('kind')):
                meta = (<DecoratorContext>contextOrClass).metadata;
                break;
            case isConstructor(contextOrClass):
                meta = contextOrClass[Symbol['metadata']];
                break;
            case isClass(contextOrClass):
                meta = (<Object>contextOrClass).constructor[Symbol['metadata']]
                break;
            default:
                throw new Error(`Invalid context argument for metadata.get: ${contextOrClass}`)
        }
        if (!meta) {
            const name = isConstructor(contextOrClass) ? (<Constructor<OfType>>contextOrClass).name : String((<DecoratorContext>contextOrClass).name);
            throw new Error(`metadata not defined for ${name}`)
        }
        meta[field] ??= init instanceof Function ? init() : init;
        return meta[field] as OfType;
    },
    getArray<OfType>(
        context: DecoratorContext | Object,
        field: string | symbol,
        init: Array<OfType> | (() => Array<OfType>) = new Array<OfType>()) {
        return this.get<Array<OfType>>(context, field, init);
    },
    getMap<K, OfType>(
        context: DecoratorContext | Object, field: string | symbol,
        init: Map<K, OfType> | (() => Map<K, OfType>) = (new Map<K, OfType>())
    ) {
        return this.get<Map<K, OfType>>(context, field, init);
    },
    getSet<OfType>(
        context: DecoratorContext | Object,
        field: string | symbol,
        init: Set<OfType> | (() => Set<OfType>) = (new Set<OfType>())
    ) {
        return this.get<Set<OfType>>(context, field, init);
    },
    getFunction<F = (args: any) => any>(
        contextOrClass: | Constructor<any> | Object,
        field: string | symbol
    ) {
        let meta: any;
        switch (true) {
            case (contextOrClass.hasOwnProperty('kind')):
                meta = (<DecoratorContext>contextOrClass).metadata;
                break;
            case isConstructor(contextOrClass):
                meta = contextOrClass[Symbol['metadata']];
                break;
            case isClass(contextOrClass):
                meta = (<Object>contextOrClass).constructor[Symbol['metadata']]
                break;
            default:
                throw new Error(`Invalid context argument for metadata.get: ${contextOrClass}`)
        }
        if (!meta) {
            const name = isConstructor(contextOrClass) ? (<Constructor<any>>contextOrClass).name : String((<DecoratorContext>contextOrClass).name);
            throw new Error(`metadata not defined for ${name}`)
        }
        return meta[field] as F;
    },
    setFunction<F = (args: any) => any>(
        contextOrClass: | Constructor<any> | Object,
        field: string | symbol,
        value: F
    ) {
        let meta: any;
        switch (true) {
            case (contextOrClass.hasOwnProperty('kind')):
                meta = (<DecoratorContext>contextOrClass).metadata;
                break;
            case isConstructor(contextOrClass):
                meta = contextOrClass[Symbol['metadata']];
                break;
            case isClass(contextOrClass):
                meta = (<Object>contextOrClass).constructor[Symbol['metadata']]
                break;
            default:
                throw new Error(`Invalid context argument for metadata.get: ${contextOrClass}`)
        }
        if (!meta) {
            const name = isConstructor(contextOrClass) ? (<Constructor<any>>contextOrClass).name : String((<DecoratorContext>contextOrClass).name);
            throw new Error(`metadata not defined for ${name}`)
        }
        meta[field] = value;
    }


}