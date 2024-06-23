<MonsterTabelle></MonsterTabelle>

<LayoutGrid>
  <Cell span={8}>
    <InnerGrid>
      <Cell span="{12}">
        <h1>Monster</h1>
      </Cell>
      <Cell span="{6}">
        <h2>Name</h2>
        <Textfield
            type="text"
            bind:value={monsterName}
            label="Name"
            style="width: 100%"/>
        <h2>Typ</h2>
        <SegmentedButton segments={elements} let:segment singleSelect bind:selected={monsterTyp}>
          <!-- Note: the `segment` property is required! -->
          <Segment {segment}>
            <Label>{segment}</Label>
          </Segment>
        </SegmentedButton>
        <h2>Stufe</h2> {stufe()} {bezeichnung()}
      </Cell>
      <Cell span={6}>
        <h2>Attribute</h2>
        <AttributSlider bind:value={attribute.hp} name="HP" typeEffect={monsterTyp === 'Holz'}/>
        <AttributSlider bind:value={attribute.ang} name="ATK" typeEffect={monsterTyp === 'Feuer'}/>
        <AttributSlider bind:value={attribute.mag} name="MAG" typeEffect={monsterTyp === 'Wasser'}/>
        <AttributSlider bind:value={attribute.def} name="DEF" typeEffect={monsterTyp === 'Erde'}/>
        <AttributSlider bind:value={attribute.speed} name="SPEED" typeEffect={monsterTyp === 'Metall'}/>
      </Cell>
      <Cell span="{12}">
        Tags:
        <Set chips={[...tagChoicesDynamic[monsterTyp],...tagChoicesStatic]} let:chip filter bind:selected={tags}>
          <Chip {chip} touch>
            <Text>{chip}</Text>
          </Chip>
        </Set>
      </Cell>
    </InnerGrid>
  </Cell>
  <Cell span={4}>
    <img class="avatar" src="{image}" alt="{monsterName}" style="margin: 0 auto"/>
    <div style="border: 1px solid white; border-radius: 20px; padding: 0 20px 20px 20px; margin-top: 50px">
      <h3>Talent Name</h3>
      <Textfield bind:value={talentName} type="test" style="width: 100%"></Textfield>
      <h4>Beschreibung</h4>
      <Textfield textarea bind:value={talentBeschreibung} style="width: 100%"></Textfield>
    </div>
  </Cell>
</LayoutGrid>
<button type="submit" on:click={() => handleSubmit()}>Add Monster</button>

<style lang="sass">
  .avatar
    max-width: 500px
</style>

<script lang="ts">
  import Textfield from "@smui/textfield";
  import SegmentedButton, {Segment} from '@smui/segmented-button';
  import {Label} from '@smui/common';
  import LayoutGrid, {Cell, InnerGrid} from '@smui/layout-grid';
  import Chip, {Set, Text} from '@smui/chips';
  import AttributSlider from "./AttributSlider.svelte";
  import {onMount} from "svelte";
  import {createMonster, loadImage, loadMonsters} from "$lib/apis/monsterApi";
  import MonsterTabelle from "../../components/MonsterTabelle.svelte";
  import {monsterStore} from "../../stores/Monster.store";

  let elements = ['Erde', 'Feuer', 'Holz', 'Metall', 'Wasser']
  let tagChoicesDynamic = {
    'Feuer': ['Feuer', 'Dinos', 'Schatten', 'Sonne', 'Bestie'],
    'Wasser': ['Wasser', 'Zeit', 'Eis', 'Mond', 'Geist'],
    'Metall': ['Metall', 'Licht', 'Engel', 'Luft', 'Elektro'],
    'Holz': ['Holz', 'Pflanze', 'Tier', 'Fee', 'Monster'],
    'Erde': ['Erde', 'Dämonen', 'Untote', 'Teufel', 'Untergrund']
  };
  let tagChoicesStatic = ['Rot', 'Blau', 'Grün', 'Gelb', 'Weiß', 'Schwarz', 'Pink', 'Lila', 'Braun', 'Orange', 'Groß', 'Klein', 'Mittel', 'Süß',
    'Kräftig', 'Cool', 'Mystisch'];
  let image: any;
  let monsterName: string = '';
  let monsterTyp: 'Erde' | 'Holz' | 'Metall' | 'Feuer' | 'Wasser' = 'Erde';
  let attribute: { hp: number, ang: number, mag: number, def: number, speed: number } = {
    hp: rand(1, 5),
    ang: rand(1, 5),
    mag: rand(1, 5),
    def: rand(1, 5),
    speed: rand(1, 5)
  };
  let tags: string[] = [];
  let talentName: string = '';
  let talentBeschreibung: string = '';

  function rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  onMount(() => {
    loadMonster()
    monsterStore.subscribe(monster => {
      monsterName = monster.name
      monsterTyp = monster.typ
      image = monster.image
      tags = monster.tags
    });
  })

  function loadMonster() {
    loadMonsters().then(data => console.log(data));
    loadImage().then(image => image = image)
  }

  function handleSubmit() {
    createMonster({
      name: monsterName, typ: monsterTyp, stufe: stufe(), attr: {
        hp: attribute.hp, ang: attribute.ang,
        mag: attribute.mag, def: attribute.def, speed: attribute.speed
      }, tags, image,
      talent: {name: talentName, beschreibung: talentBeschreibung}
    })
    .then(loadMonster)
  }

  $: stufe = () => {
    return Math.ceil((attribute.hp + attribute.ang + attribute.mag + attribute.def + attribute.speed - 5) / 6);
  }
  $: bezeichnung = () => {
    let attributDiff = (attribute.hp + attribute.ang + attribute.mag + attribute.def + attribute.speed - 5) % 6;
    switch (attributDiff) {
      case 1:
      case 2:
        return 'zu schwach';
      case 5:
      case 4:
        return 'fast +' + (6 - attributDiff);
      case 0:
        return 'optimal';
      default:
        return '';
    }
  }
</script>