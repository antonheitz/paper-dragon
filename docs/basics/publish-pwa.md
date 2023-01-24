# Publishing the PWA

Please build the app first as described in [the angular basics](angular.md)

Making the PWA available needs a build being served via HTTPS. 

This can be achieved while serving the `dist/targetnotes/` folder via a HTTPS enabled server or via Github Pages:

```bash
ng deploy --base-href=https://<gh-user>.github.io/<repository>/
```

For this you can create a fork of the Project and then get the URL from your fork settings.