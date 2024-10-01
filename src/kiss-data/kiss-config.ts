

export class KissConfig {
    /**
     * CURRENT_VERSION is used for configuration of KissUpgradablData
     * This variable should be overwritten with the current version
     * of your data model
     */
    static CURRENT_VERSION = 0.01;

    /**
     * When src['protocol-version'] < KissConfig.CURRENT_VERSION first
     * KissUpgradablData tries to call function marked with @RegisterMigrate 
     * decorator in the child class, if no such function exist, this globalMigrate
     * function is called. This function should be overwritten to 
     * handle data upgrading at a cerntral point without using @RegisterMigrate
     * @param src The source object to migrate
     */
    static globalMigrate(from) : any  {
        // throw new Error(`metadata not defined for ${this.constructor?.name}`)
        throw Error(`Migrating ${this?.constructor?.name} from ${from['protocol-version']} to ${KissConfig.CURRENT_VERSION} is not implemented`)
    }
}