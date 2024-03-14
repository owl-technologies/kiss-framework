import { ConstructorOrFunction } from "../decorators/types.js";
import { KissData } from "../kiss-data.js";
import { CidLink } from "./cid-link.js";
import { GetSetJson, GetSetJsonArray, InitJson, InitJsonArray } from "./init-json.js";


export function InitCid<T extends KissData, V> (
    transformOrResponseType: ConstructorOrFunction<V> | 'arraybuffer' | 'json' = 'json',
    responseType: 'arraybuffer' | 'json' = 'json'
) : ReturnType<typeof InitJson<T, CidLink<V>>> {
    switch (true) { 
        case (typeof transformOrResponseType === 'function'):
            return InitJson<T, CidLink<V>>((link: any) => new CidLink<V>(link, <ConstructorOrFunction<V>>transformOrResponseType, responseType));
        case (transformOrResponseType === 'arraybuffer'):
            return InitJson<T, CidLink<V>>((data) => new CidLink<V>(data, undefined, 'arraybuffer'));
        case (transformOrResponseType === 'json'):
            return InitJson<T, CidLink<V>>((link) => new CidLink<V>(link));
        default:
            throw new Error(`Invalid argument for InitCid: ${transformOrResponseType}`)
    }
}

export function GetSetCid<T extends KissData, V> (
    transformOrResponseType: ConstructorOrFunction<V> | 'arraybuffer' | 'json' = 'json',
    responseType: 'arraybuffer' | 'json' = 'json'
) : ReturnType<typeof GetSetJson<T, CidLink<V>>> {
    switch (true) {
        case (typeof transformOrResponseType === 'function'):
            return GetSetJson<T, CidLink<V>>((link: any) => new CidLink<V>(link, <ConstructorOrFunction<V>>transformOrResponseType, responseType)) as any;
        case (transformOrResponseType === 'arraybuffer'):
            return GetSetJson<T, CidLink<V>>((data) => new CidLink<V>(data, undefined, 'arraybuffer'));
        case (transformOrResponseType === 'json'):
            return GetSetJson<T, CidLink<V>>((link) => new CidLink<V>(link));
        default:
            throw new Error(`Invalid argument for InitCid: ${transformOrResponseType}`)
    }
}

export function InitCidArray<T extends KissData, V>(
    transformOrResponseType: ConstructorOrFunction<V> | 'arraybuffer' | 'json' = 'json',
    responseType: 'arraybuffer' | 'json' = 'json'): ReturnType<typeof InitJson<T,CidLink<V>[]>> {
    switch (true) {
        case (typeof transformOrResponseType === 'function'):
            return InitJsonArray<T,CidLink<V>>(l => new CidLink<V>(l, <ConstructorOrFunction<V>>transformOrResponseType, responseType));
        case (transformOrResponseType === 'arraybuffer'):
            return InitJsonArray<T,CidLink<V>>(l => new CidLink<V>(l, undefined, 'arraybuffer'));
        case (transformOrResponseType === 'json'):
            return InitJsonArray<T,CidLink<V>>(l => new CidLink<V>(l, undefined, 'json'));
        default:
            throw new Error(`Invalid argument for InitCid: ${transformOrResponseType}`)
    }
}

export function GetSetCidArray<T extends KissData, V>(
    transformOrResponseType: ConstructorOrFunction<V> | 'arraybuffer' | 'json' = 'json',
    responseType: 'arraybuffer' | 'json' = 'json'): ReturnType<typeof GetSetJson<T,CidLink<V>[]>> {
    switch (true) {
        case (typeof transformOrResponseType === 'function'):
            return GetSetJsonArray<T,CidLink<V>>(l => new CidLink<V>(l, <ConstructorOrFunction<V>>transformOrResponseType, responseType));
        case (transformOrResponseType === 'arraybuffer'):
            return GetSetJsonArray<T,CidLink<V>>(l => new CidLink<V>(l, undefined, 'arraybuffer'));
        case (transformOrResponseType === 'json'):
            return GetSetJsonArray<T,CidLink<V>>(l => new CidLink<V>(l, undefined, 'json'));
        default:
            throw new Error(`Invalid argument for InitCid: ${transformOrResponseType}`)
    }
}