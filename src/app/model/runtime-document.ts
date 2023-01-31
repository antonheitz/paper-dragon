import { BaseDocument } from "./base-document"
import { RuntimeFile } from "./runtime/runtime-file"
import { RuntimeFolder } from "./runtime/runtime-folder"
import { RuntimeNote } from "./runtime/runtime-note"
import { RuntimeRemoteWorkspace } from "./runtime/runtime-remote-workspace"
import { RuntimeSpaceConf } from "./runtime/runtime-space-conf"
import { RuntimeUserConf } from "./runtime/runtime-user-conf"

export interface BaseRuntimeDocument extends BaseDocument {
    decrypted: boolean
}

export type RuntimeDocument = RuntimeFile | RuntimeFolder | RuntimeNote | RuntimeRemoteWorkspace | RuntimeSpaceConf | RuntimeUserConf;