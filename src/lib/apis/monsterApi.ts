import type {Monster} from "../../models/Monster";

export const backendUrl = "http://localhost:8080/"
export const monsterURL = `${backendUrl}monster`

const headers = {
  'Content-Type': 'application/json'
}

export async function createMonster(monster: Monster): Promise<Monster> {
  const response = await fetch(monsterURL, {
    method: 'PUT',
    headers,
    body: JSON.stringify(monster)
  });
  return await response.json();
}
export async function loadMonsters(): Promise<Monster[]> {
  const response = await fetch(monsterURL, {
    method: 'GET',
    headers
  });
  return await response.json();
}

export async function loadImage(): Promise<String> {
  const response = await fetch('http://localhost:8080/monster/random-image', {
    method: 'GET',
    headers
  });
  return `${backendUrl}${await response.text()}`;
}
