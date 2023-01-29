import { BaseDocument } from "../base-document"

export interface EncryptedRemoteWorkspace extends BaseDocument {
    remoteConfig: string
    pwHash: string
    type: "workspace"
}

