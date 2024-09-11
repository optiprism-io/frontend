<template>
  <h2 class="pf-u-font-size-xl pf-u-font-family-heading-sans-serif">
    JavaScript Integration
  </h2>

  <b> sdkToken: {{ sdkToken }} </b>

  <p>
    <UiCodeBlock :code="code" />
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import UiCodeBlock from '@/components/uikit/UiCodeBlock.vue'

interface Props {
  sdkToken?: string
}

const props = withDefaults(defineProps<Props>(), {
  sdkToken: '',
})

const code = computed(
  () => `<!-- place the code before the </head> tag -->
<script type="text/javascript" src="https://demdxx.optiprism.io/tracker.js"><\/script>
<script>
  optiprism.configure({
    token: ${props.sdkToken},
    serverUrl: 'https://${window.location.host}/api/v1',
  })
<\/script>
`
)
</script>
