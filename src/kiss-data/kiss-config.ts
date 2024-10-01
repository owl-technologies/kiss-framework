import { Singleton } from "./decorators/singleton.js";

@Singleton
export class KissConfig {
    static CURRENT_VERSION = 0.01;
}