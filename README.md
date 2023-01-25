# Targetnotes

## Project Philosophy

This Notes app is made to solve some issues with the most open-source apps. These are:

 - **Security**: 

   Almost all notes apps out there do not encypt the note on the local drive. This can be very crucial to the security, since a lot of differnt applications can access the Filesyste and read the contents of the Notes. Fun comment: many apps claim to be e2e-encrypted, while only taling about the sync of the data. This app is r2r (runtime2runtime) encrypted.

 - **Availability**: 
   
   Some notes that provide great features sadly are not available on all common Plattforms/Operating Systems. Also for some OS/Hardware the build and publish needs a lot of prequisites. This app uses the PWA (Progressive Webapp) with a offline-first model, which is easily deployable to any device running Chrome, Mozilla, or Safari with one click.

 - **Fexible syncing**: 

   Syncing the notes for the most open-source apps out there that is either very slow or needs a lot of customized infrastructure. The Goal of this project is to use the fast and efficient direct sync between the app and any CouchDB-instance (open source, easy to set up, and available by numerus external hosts).

 - **Freedom of use**: 

   This project will be licenced under [Apache 2.0 Licence](LICENCE.md). Therefore it is open to any use in this licence context.

 - **Contribution**: 
   
   Anyone is more than welcome to contribute to this project as they like. Please keep discussions polite and strive for stable features!

## Documentation 

### Basics
 - [Angular Basics](docs/basics/angular.md)
 - [Publishing the PWA](docs/basics/publish-pwa.md)
 - [Install the PWA](docs/basics/install-pwa.md)
 - Contribution (TBD)

### Deep Dive

 - [High level Data Encryption & storage flow](docs/deep-dive/encryption.md)
 - [Users and Workspaces](docks/deep-dive/users-and-workspaces.md)