import { BaseItem } from "./base-item";

export interface RemoteWorkspace extends BaseItem {
    remoteConfig: string
    pwHash: string
    type: "workspace"
}