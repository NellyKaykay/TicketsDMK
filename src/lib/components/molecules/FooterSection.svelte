<script lang="ts">
  export let title: string;
  export let links: Array<{ text: string; href: string; external?: boolean }> = [];
</script>

<div class="space-y-4">
  <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase">
    {title}
  </h3>
  
  <ul class="space-y-0">
    {#each links as link}
      <li>
        <a 
          href={link.href}
          class="text-base text-gray-500 hover:text-gray-900 transition-colors duration-200"
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
        >
          {link.text}
          {#if link.external}
            <svg class="w-3 h-3 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          {/if}
        </a>
      </li>
    {/each}
  </ul>
</div>