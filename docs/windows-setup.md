# Windows Setup

Takeoff currently does not work on Windows. To attempt setup it does require a few steps to get it working.

To see the current issues affecting Windows [click here](https://github.com/tanepiper/takeoff/labels/windows)

Along side the latest version of Docker Community Edition, you need to ensure you install the following global dependencies for node:

```bash
npm install --global --production windows-build-tools
npm install --global --production node-gyp node-pre-gyp
```

Windows build tool will install Python and Visual Studio tools to allow compiling of native modules (BCrypt and Sass being the main two).
