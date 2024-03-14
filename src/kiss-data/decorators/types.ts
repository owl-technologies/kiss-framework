// export type OpLink<To = any, From = any> = ClassAccessorDecoratorResult<To, From>;

export type PromiseReturnType<T extends (...args: any) => any> = Awaited<ReturnType<T>>;

export type OpLink<To = any, From = any> = {
    link: From;
    set(value: To): void;
    get(): To | Promise<To>; // this return type is the only difference between OpLink and ClassAccessorDecoratorResult
    toJSON(): any;
};

export abstract class SearchableById {
    static idPrefix: string;
};

export abstract class SearchableByName {
    static namePrefix: string;
};

export type Constructor<T> = { new(...data: any[]) : T };

export type ConstructorOrFunction<T> = Constructor<T> | ((data: any) => T);

// export type DecoratorContext<T extends 'field' | 'accessor'> =
//     T extends 'field'
//     ? ClassFieldDecoratorContext
//     : ClassAccessorDecoratorContext;
export type x = ClassAccessorDecoratorContext

/**
 * YJS Delta format.
 * 
 * @see https://docs.yjs.dev/api/delta-format
 */
export type Delta = {
    ops: Array<{
        retain?: number;
        insert?: any;
        delete?: number;
        attributes?: {
            [key: string]: any;
        };
    }>;
}

export type GatewayFn = <To>(cid: string, transform?: ConstructorOrFunction<To>, responseType?: 'arraybuffer' | 'json') => Promise<To>;