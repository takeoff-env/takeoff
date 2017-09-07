# Takeoff Frontend App

> *As of this readme, the current verion of the frontend needs some work to fix it, but I will still cover it in documentation*

The Takeoff frontend app is provided to take out all the hassle of setting up a React application.

It uses React 15 currently, with React Router v4, and a Redux store.

The architecture is that the `index.js` file boostraps the app inside a `react-hot-loader` application (there is also some service worker stuff here, but that will be discussed later).

The main App then creates the Redux store and React Router, and triggers the View.

Inside the view is then a NavBar and main Switch for the router, here you can define routes to components.  Inside the NavBar you have the opertunity to add Link tags that will generate router calls.

Currently the app uses the HashRouter until an issue with the proxy can be resolved.

## API Documentation

* [Configuring using environment variables](docs/using-env-file.md)
