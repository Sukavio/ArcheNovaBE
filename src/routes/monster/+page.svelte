<form on:submit|preventDefault={handleSubmit} class="form">
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
          <AttributSlider bind:value={attribute.atk} name="ATK" typeEffect={monsterTyp === 'Feuer'}/>
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
        <Cell span={6} style="border: 1px solid white; border-radius: 20px; padding: 0 20px 20px 20px">
          <h3>Talent Name</h3>
          <Textfield bind:value={talentName} type="test" style="width: 100%"></Textfield>
          <h4>Beschreibung</h4>
          <Textfield textarea bind:value={talentBeschreibung} style="width: 100%"></Textfield>
        </Cell>
      </InnerGrid>
    </Cell>
    <Cell span={4}>
      <img class="avatar" src="{avatar}" alt="{monsterName}"/><br/>
      <input type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)}>
    </Cell>
  </LayoutGrid>
</form>

<style lang="sass">
  .form
    display: flex
    flex-direction: column

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
  let attr = ['0', '1', '2', '3', '4', '5', '6', '7']

  let avatar: any;
  let monsterName: string = '';
  let monsterTyp: string = 'Erde';
  let attribute: { hp: number, atk: number, mag: number, def: number, speed: number } = {hp: 0, atk: 0, mag: 0, def: 0, speed: 0};
  let tags: string[] = [];
  let talentName: string = '';
  let talentBeschreibung: string = '';
  function handleSubmit() {

  }

  $: stufe = () => {
    return Math.ceil((attribute.hp + attribute.atk + attribute.mag + attribute.def + attribute.speed - 5) / 6);
  }
  $: bezeichnung = () => {
    let attributDiff = (attribute.hp + attribute.atk + attribute.mag + attribute.def + attribute.speed - 5) % 6;
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

  const onFileSelected = (e: any) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = e => {
      avatar = e.target?.result
    }
  };
</script>