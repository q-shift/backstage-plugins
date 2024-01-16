## Developer Documentation

When you develop a new feature for the Quarkus plugins and would like to test them using a backstage applicaton generated in a dummy project using `npx @backstage/create-app`, then you can use the following steps to link the plugins workspaces to the `dummy` project

- Create a new application called `dummy using `npx @backstage/create-app`
- Edit the `package.json` file to specify the following `"packageManager": "yarn@4.0.2"`
- Launch `yarn install; yarn dev` to verify if backstage starts
- Follow the README instructions to install our plugins
- Link this project containing the plugins you would like to test using this command:
  `yarn link /path/to/backstage-plugins --all`

**NOTE**: if the workspaces have been properly linked, then you should be able to see 2 new entries part of the package.json file:
```json
},
  "resolutions": {
  "@types/react": "^17",
  "@types/react-dom": "^17",
  "swagger-ui-react": "5.10.5",
  "@qshift/plugin-quarkus": "portal:/path/to/backstage-plugins/plugins/quarkus",
  "@qshift/plugin-quarkus-backend": "portal:/path/to/backstage-plugins/plugins/quarkus-backend"
},
```

and the `node_modules` folder should contain for `@qshift` module such symbolic links:
```bash
ls -la node_modules/@qshift 
total 0
drwxr-xr-x@    4 cmoullia  staff    128 Jan 16 18:27 .
drwxr-xr-x@ 1751 cmoullia  staff  56032 Jan 16 18:25 ..
lrwxr-xr-x@    1 cmoullia  staff     81 Jan 16 18:27 plugin-quarkus -> ../../../../../code/openshift/backstage/plugins/backstage-plugins/plugins/quarkus
lrwxr-xr-x@    1 cmoullia  staff     89 Jan 16 18:27 plugin-quarkus-backend -> ../../../../../code/openshift/backstage/plugins/backstage-plugins/plugins/quarkus-backend
```