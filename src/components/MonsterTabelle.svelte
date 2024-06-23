{#await loadMonsters()}
  Loading...
{:then monsters}
  {#each monsters as monster}
    <p on:click={() => monsterStore.set(monster)} role="button" tabindex="0"
    >{#if monster.image}<img src={monster.image} alt={monster.name} style="height: 40px;vertical-align: middle"/> {/if}{monster.name} [{monster.typ}] ({monster.stufe})</p>
  {/each} 
{:catch error}
  <p>{error}</p>
{/await}

<script lang="ts">
  import {loadMonsters} from "$lib/apis/monsterApi";
  import {monsterStore} from "../stores/Monster.store";
</script>