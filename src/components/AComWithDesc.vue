<template>
  <ElTooltip placement="top" :content="content" role="tooltip">
      <slot></slot>
  </ElTooltip>
</template>

<script lang="ts" setup>
import { ElTooltip } from 'element-plus'
import { defineProps, ref } from 'vue'

const props = defineProps({
  content: {
    type: String,
  },
})

</script>