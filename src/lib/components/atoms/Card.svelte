<script lang="ts">
  // Card fiel al diseño actual
  let className = '';
  export { className as class };
  export let style = '';
</script>

<div class="rounded-[20px] shadow-md hover:shadow-xl overflow-hidden flex flex-col h-full bg-white transition-shadow duration-300 {className}" {style}>
  <slot />
</div>