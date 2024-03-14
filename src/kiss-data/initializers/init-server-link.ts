import { Constructor, SearchableById, SearchableByName } from "../decorators/types.js";
import { GetSetJson, GetSetJsonArray, InitJson, InitJsonArray } from "./init-json.js";
import { OpServerLink } from "./server-link.js";

export function InitByName<R extends SearchableByName, V extends Constructor<R>>(initConstructor: V) {
    const prefix = initConstructor["namePrefix"];
    return InitJson((username: any) => new OpServerLink<R>(username, prefix, initConstructor as Constructor<R>)) as any;
}

export function GetSetByName<R extends SearchableByName, V extends Constructor<R>>(initConstructor: V) {
    const prefix = initConstructor["namePrefix"];
    return GetSetJson((username: any) => new OpServerLink<R>(username, prefix, initConstructor as Constructor<R>)) as any;
}

export function GetSetByNameArray<R extends SearchableByName, V extends Constructor<R>>(initConstructor: V) {
    const prefix = initConstructor["namePrefix"];
    return GetSetJsonArray((username: any) => new OpServerLink<R>(username, prefix, initConstructor as Constructor<R>)) as any;
}

export function InitByNameArray<R extends SearchableByName, V extends Constructor<R>>(initConstructor: V) {
    const prefix = initConstructor["namePrefix"];
    return InitJsonArray((username: any) => new OpServerLink<R>(username, prefix, initConstructor as Constructor<R>)) as any;
}

export function InitById<R extends SearchableById, V extends Constructor<R>>(initConstructor: V) {
    // console.log('initConstructor: ', initConstructor);
    const prefix = initConstructor["idPrefix"];
    return InitJson((id: any) => new OpServerLink<R>(id, prefix, initConstructor as Constructor<R>)) as any;
}

export function InitByIdArray<R extends SearchableById, V extends Constructor<R>>(initConstructor: V) {
    const prefix = initConstructor["idPrefix"];
    return InitJsonArray((id: any) => new OpServerLink<R>(id, prefix, initConstructor as Constructor<R>)) as any;
}

export function GetSetById<R extends SearchableById, V extends Constructor<R>>(initConstructor: V) {
    const prefix = initConstructor["idPrefix"];
    return GetSetJson((id: any) => new OpServerLink<R>(id, prefix, initConstructor as Constructor<R>)) as any;
}

export function GetSetByIdArray<R extends SearchableById, V extends Constructor<R>>(initConstructor: V) {
    const prefix = initConstructor["idPrefix"];
    return GetSetJsonArray((id: any) => new OpServerLink<R>(id, prefix, initConstructor as Constructor<R>)) as any;
}
