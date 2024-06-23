import {writable} from "svelte/store";
import type {Monster} from "../models/Monster";

export const monsterStore = writable<Monster>()