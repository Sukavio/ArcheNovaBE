import {writable} from "svelte/store";
import type {Monster} from "../models/Monster";
import {rand} from "$lib/utils";
import {loadImage, loadMonsters} from "$lib/apis/monsterApi";

export const monsterStore = writable<Monster>({
    name: '',
    stufe: 1,
    typ: 'Erde',
    tags: [],
    image: await loadImage(),
    talent: {
        name: "",
        beschreibung: ""
    },
    attr: {
        hp: rand(1, 5),
        ang: rand(1, 5),
        mag: rand(1, 5),
        def: rand(1, 5),
        speed: rand(1, 5)
    }
} as Monster)

export const monstersStore = writable<Monster[]>([])

export async function loadMonstersStore() {
    monstersStore.set(await loadMonsters())
}

export async function nextMonsterStore() {
    monsterStore.set({
        name: '',
        stufe: 1,
        typ: 'Erde',
        tags: [],
        image: await loadImage(),
        talent: {
            name: "",
            beschreibung: ""
        },
        attr: {
            hp: rand(1, 5),
            ang: rand(1, 5),
            mag: rand(1, 5),
            def: rand(1, 5),
            speed: rand(1, 5)
        }
    } as Monster)
}