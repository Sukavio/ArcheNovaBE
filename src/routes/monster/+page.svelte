<style lang="sass">
  .chipset
    display: flex
    flex-direction: row
    border: 1px solid black
    border-radius: 5px

    & > div
      padding: 5px

    & > div:first-child
      background-color: lightblue
      width: 100%
      border-bottom-left-radius: 5px
      border-top-left-radius: 5px

    & > div:last-child
      background-color: lightcoral
      border-bottom-right-radius: 5px
      border-top-right-radius: 5px

  .avatar
    max-width: 500px
</style>>

<MonsterTabelle></MonsterTabelle>
<Button on:click={() => nextMonsterStore()}>Nächstes Monster</Button>
<Button on:click={() => handleSubmit()}>+ Hinzufügen</Button>

<LayoutGrid>
    {#each groupByStufen as stufe, index}
        {#if stufe > 0}
            <Cell span={1}>
                <div class="chipset">
                    <div>Stufe {index}</div>
                    <div>{stufe}</div>
            </Cell>
        {/if}
    {/each}
    {#each groupByTags as [tag, counter]}
        {#if counter > 0}
            <Cell span={Math.ceil(tag.length / 6)}>
                <div class="chipset">
                    <div>{tag}</div>
                    <div>{counter}</div>
                </div>
            </Cell>
        {/if}
    {/each}
</LayoutGrid>

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
                <h2>Stufe</h2> {stufe()} ({groupByStufen[stufe()]}) {bezeichnung()}
            </Cell>
            <Cell span={6}>
                <h2>Attribute</h2>
                <AttributSlider bind:value={attribute.hp} name="HP" typeEffect={monsterTyp === 'Holz'}/>
                <AttributSlider bind:value={attribute.ang} name="ATK" typeEffect={monsterTyp === 'Feuer'}/>
                <AttributSlider bind:value={attribute.mag} name="MAG" typeEffect={monsterTyp === 'Wasser'}/>
                <AttributSlider bind:value={attribute.def} name="DEF" typeEffect={monsterTyp === 'Erde'}/>
                <AttributSlider bind:value={attribute.speed} name="SPEED" typeEffect={monsterTyp === 'Metall'}/>
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
    <Cell span="{12}">
        Tags:
        <Set chips={[...tagChoicesDynamic[monsterTyp],...tagChoicesStatic]} let:chip filter
             bind:selected={tags}>
            <Chip {chip} touch>
                <Text>{chip} {groupByTags.get(chip) ?? 0}</Text>
            </Chip>
        </Set>
    </Cell>
</LayoutGrid>

<script lang="ts">
    import Textfield from "@smui/textfield";
    import SegmentedButton, {Segment} from '@smui/segmented-button';
    import {Label} from '@smui/common';
    import LayoutGrid, {Cell, InnerGrid} from '@smui/layout-grid';
    import Chip, {Set, Text} from '@smui/chips';
    import AttributSlider from "./AttributSlider.svelte";
    import {onDestroy, onMount} from "svelte";
    import {createMonster, loadImage, loadMonsters} from "$lib/apis/monsterApi";
    import MonsterTabelle from "../../components/MonsterTabelle.svelte";
    import {loadMonstersStore, monstersStore, monsterStore, nextMonsterStore} from "../../stores/Monster.store";
    import {rand} from "$lib/utils";
    import Button from '@smui/button';
    import type {Unsubscriber} from "svelte/store";

    let elements = ['Erde', 'Feuer', 'Holz', 'Metall', 'Wasser']
    let tagChoicesDynamic = {
        'Feuer': ['Feuer', 'Dinos', 'Schatten', 'Sonne', 'Bestie'],
        'Wasser': ['Wasser', 'Zeit', 'Eis', 'Mond', 'Geist'],
        'Metall': ['Metall', 'Licht', 'Engel', 'Luft', 'Elektro'],
        'Holz': ['Holz', 'Pflanze', 'Tier', 'Fee', 'Monster'],
        'Erde': ['Erde', 'Dämonen', 'Untote', 'Teufel', 'Untergrund']
    };
    let tagChoicesStatic = ['Rot', 'Blau', 'Grün', 'Gelb', 'Weiß', 'Schwarz', 'Pink', 'Lila', 'Braun', 'Orange',
        'Groß', 'Klein', 'Mittel', 'Riesig', 'Gigantisch', 'Winzig',
        'Süß', 'Kräftig', 'Cool', 'Mystisch', 'Mutig', 'Schlau', 'Schnell', 'Mächtig', 'Wild', 'Freundlich',
        'Furchterregend', 'Majestätisch', 'Verspielt', 'Ruhig', 'Aggressiv', 'Loyal', 'Wachsam', 'Geduldig',
        'Ehrgeizig', 'Kreativ', 'Entschlossen', 'Einfallsreich', 'Unabhängig', 'Optimistisch'];
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

    let groupByStufen: number[] = [];
    let groupByTags: Map<string, number> = new Map();


    const subsink: Unsubscriber[] = [];

    onMount(() => {
        subsink.push(monsterStore.subscribe(monster => {
            monsterName = monster.name
            monsterTyp = monster.typ
            image = monster.image
            tags = monster.tags
            talentName = monster.talent.name
            talentBeschreibung = monster.talent.beschreibung
            attribute = monster.attr
        }))
        subsink.push(monstersStore.subscribe(value => {
            groupByStufen = value.reduce((acc, {stufe}) => {
                acc[stufe] = (acc[stufe] || 0) + 1;
                return acc;
            }, [0, 0, 0, 0, 0, 0, 0, 0])
            groupByTags = value.reduce((acc, curr) => {
                curr.tags.forEach(tag => {
                    acc.set(tag, (acc.get(tag) || 0) + 1)
                })
                return acc;
            }, new Map<string, number>())
        }))
    })

    onDestroy(() => {
        subsink.forEach(sub => sub())
    })

    function handleSubmit() {
        createMonster({
            name: monsterName, typ: monsterTyp, stufe: stufe(), attr: {
                hp: attribute.hp, ang: attribute.ang,
                mag: attribute.mag, def: attribute.def, speed: attribute.speed
            }, tags, image,
            talent: {name: talentName, beschreibung: talentBeschreibung}
        }).then(() => {
            loadMonstersStore()
        })
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