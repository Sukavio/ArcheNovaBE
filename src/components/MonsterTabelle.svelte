<style lang="sass">
  img
    height: 40px
    vertical-align: middle

  .monster
    cursor: pointer
    padding: 10px 10px
    border-radius: 10px
    border: 1px solid black
    &:hover
      background-color: lightgray
</style>

<script lang="ts">
    import {loadMonstersStore, monstersStore, monsterStore} from "../stores/Monster.store";
    import type {Monster} from "../models/Monster";
    import {onMount} from "svelte";
    import LayoutGrid, {Cell} from "@smui/layout-grid";

    let monsters: Monster[] = [];
    monstersStore.subscribe(value => {
        monsters = value;
    });

    onMount(() => {
        loadMonstersStore();
    })
</script>

<LayoutGrid>
    {#each monsters as monster (monster.name)}
        <Cell span={3}>
            <div on:click={() => monsterStore.set(monster)} class="monster">
                {#if monster.image}<img src={monster.image} alt={monster.name}/> {/if}{monster.name} [{monster.typ}]
                ({monster.stufe})
            </div>
        </Cell>
    {/each}
</LayoutGrid>