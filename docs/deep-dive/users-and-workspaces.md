# Users and Workspaces

The Architecture of the notes app allows Users to be registered in private remote databases (or also only locally) but still collaborate with workspaces on different servers!

## Everyone can share workspaces, even across servers!

```mermaid
flowchart LR
    subgraph "Couch DB Server Three"
        subgraph "User DB"
            user4[User Four]
        end
        workspace5[Workspace Five]
    end
    subgraph "Couch DB Server Two"
        subgraph "User DB"
            user3[User Three]
        end
        workspace4[Workspace Four]
    end
    subgraph "Couch DB Server One"
        subgraph "User DB"
            user1[User One]
            user2[User Two]
        end
        workspace1[Workspace One]
        workspace2[Workspace Two]
        workspace3[Workspace Three]
    end
    user1 ---> workspace1
    user1 ---> workspace2
    user2 ---> workspace2
    user2 ---> workspace3
    user2 ---> workspace5

    user3 ---> workspace4
    user3 ---> workspace2
    user4 ---> workspace4
```