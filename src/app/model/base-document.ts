import { EncryptedFile } from "./encrypted/encrypted-file"
import { EncryptedFolder } from "./encrypted/encrypted-folder"
import { EncryptedNote } from "./encrypted/encrypted-note"
import { EncryptedRemoteWorkspace } from "./encrypted/encrypted-remote-workspace"
import { EncryptedSpaceConf } from "./encrypted/encrypted-space-conf"
import { EncryptedUser } from "./encrypted/encrypted-user"

export interface BaseDocument {
    _id?: string
    _rev?: string
    type: "user" | "space-conf" | "workspace" | "folder" | "note" | "file"
}

export type EncryptedDocument = EncryptedFile | EncryptedFolder | EncryptedNote | EncryptedRemoteWorkspace | EncryptedSpaceConf | EncryptedUser;

export const RESTRICTED_NOTE_TYPES: string[] = ["user", "space-conf"]