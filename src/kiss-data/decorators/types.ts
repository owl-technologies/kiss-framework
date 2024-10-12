// export type OpLink<To = any, From = any> = ClassAccessorDecoratorResult<To, From>;

export type PromiseReturnType<T extends (...args: any) => any> = Awaited<ReturnType<T>>;

export type TransformableLink<To = any, From = any> = {
    transform?: ConstructorOrFunction<To>
    link: From;
    set(value: To): void;
    get(): To | Promise<To>; // this return type is the only difference between OpLink and ClassAccessorDecoratorResult
    toJSON(): any;
};

export type IdSearchConfiguration = {
    idPrefix: string,
    method: 'POST' | 'GET',
    authHeadersRequired: boolean,
}

export type NameSearchConfiguration = {
    namePrefix: string,
    method: 'POST' | 'GET',
    authHeadersRequired: boolean,
}

export abstract class SearchableById {
    static configuration : IdSearchConfiguration
};

export abstract class SearchableByName {
    static configuration : NameSearchConfiguration
};

export type Constructor<T> = { new(...data: any[]): T };

export type ConstructorOrFunction<T> = Constructor<T> | ((data: any) => T);

export type ConstructorFunctionEnum<T> = Constructor<T> | ((data: any) => T) | { [key: string]: ConstructorOrFunction<T> };

// export type DecoratorContext<T extends 'field' | 'accessor'> =
//     T extends 'field'
//     ? ClassFieldDecoratorContext
//     : ClassAccessorDecoratorContext;
export type x = ClassAccessorDecoratorContext


export type Delta = DeltaOps | { ops : DeltaOps}
/**
 * YJS Delta format.
 * 
 * @see https://docs.yjs.dev/api/delta-format
 */
type DeltaOps = Array<{
    retain?: number;
    insert?: any;
    delete?: number;
    attributes?: {
        [key: string]: any;
    };
}>;

export type GatewayFn = <To>(cid: string, transform?: ConstructorOrFunction<To>, responseType?: 'arraybuffer' | 'json') => Promise<To>;