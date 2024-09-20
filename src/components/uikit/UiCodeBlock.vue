<template>
  <div class="pf-c-code-block">
    <div class="pf-c-code-block__header">
      <div class="pf-c-code-block__actions">
        <div class="pf-c-code-block__actions-item">
          <button
            v-if="isSupported"
            class="pf-c-button pf-m-plain"
            type="button"
            aria-label="Copy to clipboard"
            @click="copy(code)"
          >
            <i
              v-if="!copied"
              class="fas fa-copy"
              aria-hidden="true"
            />
            <span v-else>Copied!</span>
          </button>
        </div>
      </div>
    </div>
    <div class="pf-c-code-block__content">
      <pre class="pf-c-code-block__pre"><code class="pf-c-code-block__code">{{ code }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

interface Props {
  code: string
}

withDefaults(defineProps<Props>(), {})

const { copy, copied, isSupported } = useClipboard()
</script>
