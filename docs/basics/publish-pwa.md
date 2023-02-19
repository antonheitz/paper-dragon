# Publishing the PWA

Please build the app first as described in [the angular basics](angular.md)

Making the PWA available needs a build being served via HTTPS ot localhost. 

This can be achieved while serving the `dist/paper-dragon/` folder via a HTTPS enabled server.

## GitHub Pages

Easy deployment can be achieved via Github Pages:

```bash
ng deploy --base-href=https://<gh-user>.github.io/<repository>/
```

For this you can create a fork of the Project and then get the URL from your fork settings.

## Localhost

To deploy to localhost you can use following command:

```bash
npm run deploy:local
```

This will serve the pwa on `localhost:8080`.