import { EncryptedFile } from "./storage/encrypted-file"
import { EncryptedFolder } from "./storage/encrypted-folder"
import { EncryptedNote } from "./storage/encrypted-note"
import { EncryptedRemoteWorkspace } from "./storage/encrypted-remote-workspace"
import { EncryptedSpaceConf } from "./storage/encrypted-space-conf"
import { EncryptedUserConf } from "./storage/encrypted-user-conf"

export interface BaseDocument {
    _id: string
    _rev: string
    type: "user-conf" | "space-conf" | "workspace" | "folder" | "note" | "file"
}

export type EncryptedDocument = EncryptedFile | EncryptedFolder | EncryptedNote | EncryptedRemoteWorkspace | EncryptedSpaceConf | EncryptedUserConf;
