import { EncryptedFile } from "./storage/encrypted-file"
import { EncryptedNote } from "./storage/encrypted-note"
import { EncryptedEntry } from "./storage/encrypted-entry"
import { EncryptedRemoteWorkspace } from "./storage/encrypted-remote-workspace"
import { EncryptedSpaceConf } from "./storage/encrypted-space-conf"
import { EncryptedUserConf } from "./storage/encrypted-user-conf"

export interface BaseDocument {
    _id: string
    _rev: string
    type: "user-conf" | "space-conf" | "workspace" | "note" | "entry" | "file"
}

export type EncryptedDocument = EncryptedFile | EncryptedNote | EncryptedEntry | EncryptedRemoteWorkspace | EncryptedSpaceConf | EncryptedUserConf;
