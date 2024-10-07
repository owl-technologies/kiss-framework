

export class KissConfig {
    /**
     * CURRENT_VERSION is used for configuration of KissUpgradablData
     * This variable should be overwritten with the current version
     * of your data model
     */
    static CURRENT_VERSION = 0.01;

    /**
     * This function can be overwritten to handle asynchronous data upgrading 
     * at a cerntral point. It is optional, if not defined, it is not called.
     * 
     * KissUpgradablData constructor tries to migrate data marked with @RegisterMigrate 
     * decorator. Once/if the data is migrated, globalMigrate is called 
     * with new this instance as argument allowing to deal with data upgrading at a central 
     * point asyncronously.
     * 
     * @param src The source object to migrate
     */
    static globalMigrate: ((args)=>any) | undefined = undefined
}