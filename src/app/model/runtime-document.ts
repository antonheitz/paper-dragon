import { BaseDocument } from "./base-document"
import { RuntimeFile } from "./runtime/runtime-file"
import { RuntimeNote } from "./runtime/runtime-note"
import { RuntimeEntry } from "./runtime/runtime-entry"
import { RuntimeRemoteWorkspace } from "./runtime/runtime-remote-workspace"
import { RuntimeSpaceConf } from "./runtime/runtime-space-conf"
import { RuntimeUserConf } from "./runtime/runtime-user-conf"

export interface BaseRuntimeDocument extends BaseDocument {
    decrypted: boolean
    encryptedKeys: string[]
}

export type RuntimeDocument = RuntimeFile | RuntimeNote | RuntimeEntry | RuntimeRemoteWorkspace | RuntimeSpaceConf | RuntimeUserConf;