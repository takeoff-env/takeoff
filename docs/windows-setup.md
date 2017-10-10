# Windows Setup

Takeoff currently does not work on Windows. To attempt setup it does require a few steps to get it working.

To see the current issues affecting Windows [click here](https://github.com/tanepiper/takeoff/labels/windows)

Along side the latest version of Docker Community Edition, you need to ensure you install the following global dependencies for node:

```bash
npm install --global --production windows-build-tools
npm install --global --production node-gyp node-pre-gyp
```

Windows build tool will install Python and Visual Studio tools to allow compiling of native modules (BCrypt and Sass being the main two).


## Unable to run on Port 80

If your server fails to start, you may have it bound to port 80 but find this is already being used on your system.  If this happens, open a `cmd` prompt and type `net stop w3svc`.  If this does not work, check what other services you may have running. Finally if this fails, you can edit your `docker-compose.yml` file and expose on a different external port.
