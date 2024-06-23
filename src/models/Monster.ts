export interface Monster {
  name: string,
  typ: string,
  stufe: number,
  attr: {
    hp: number,
    ang: number,
    mag: number,
    def: number,
    speed: number
  },
  tags: string[],
  image: string,
  talent: {
    name: string,
    beschreibung: string
  }
}