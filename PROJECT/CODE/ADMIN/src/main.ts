// -- IMPORTS

import { mount } from "svelte";
import "./app.styl";
import App from "./App.svelte";

// -- STATEMENTS

const target = document.getElementById("app");
if (!target) {
  throw new Error("Missing #app element");
}

const app = mount(App, {
  target,
  props: {
    url: window.location.pathname,
  },
});

export default app;

