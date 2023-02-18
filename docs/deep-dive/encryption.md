# High level Data Encryption & storage flow

The general idea is to make sure only encrypted data is stored in the pouchDB and therefore persisted on the local client as well as the replication database server.

## General Dataflow

```mermaid
flowchart TB
    subgraph Server
        replicationDB[Replication CouchDB]
    end
    subgraph LocalApp
        localDB["Local PouchDB (Persistent)"]
        encryptionSerivce[Encryption Service]
        localRuntime[Runtime Storage]
        editor[Editor]
    end
    replicationDB <-- sync encrypted notes --> localDB
    localDB -- load encryped note --> encryptionSerivce
    encryptionSerivce -- load decrypted note --> localRuntime
    localRuntime -- load note --> editor
    editor -- update note --> localRuntime
    localRuntime -- updated decrypted note --> encryptionSerivce
    encryptionSerivce -- update encrypted note --> localDB
```
