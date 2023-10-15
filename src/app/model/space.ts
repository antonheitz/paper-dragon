import { RuntimeEntry } from "./runtime/runtime-entry";
import { RuntimeFile } from "./runtime/runtime-file";
import { RuntimeNote } from "./runtime/runtime-note";
import { RuntimeRemoteWorkspace } from "./runtime/runtime-remote-workspace";
import { RuntimeSpaceConf } from "./runtime/runtime-space-conf";
import { RuntimeUserConf } from "./runtime/runtime-user-conf";

export interface Space {
    userConf: RuntimeUserConf[],
    spaceConf: RuntimeSpaceConf,
    remoteSpaces: RuntimeRemoteWorkspace[],
    notes: RuntimeNote[],
    entries: RuntimeEntry[],
    files: RuntimeFile[]
}