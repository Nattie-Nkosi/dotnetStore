import { legacy_createStore } from "@reduxjs/toolkit";
import counterReducer from "../../features/contact/counterReducer";

export function configureTheStore() {
  return legacy_createStore(counterReducer);
}