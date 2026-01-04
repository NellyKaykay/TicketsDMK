<script lang="ts">
  import Header from '$lib/components/organisms/Header.svelte';
  import '../app.css';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
</script>

<!-- Global loading screen removed. -->

<Header />
<main class="app-main">
  <slot />
</main>
