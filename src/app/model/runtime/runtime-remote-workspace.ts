import { BaseRuntimeDocument } from "../runtime-document";
import { EncryptedRemoteWorkspace } from "../storage/encrypted-remote-workspace";

export interface RuntimeRemoteWorkspace extends BaseRuntimeDocument, EncryptedRemoteWorkspace {
    type: "workspace"
}