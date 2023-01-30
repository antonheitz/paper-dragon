import { BaseItem } from "./base-item";

export interface User extends BaseItem {
    name: string,
    remoteConfig: string
    type: "user"
}