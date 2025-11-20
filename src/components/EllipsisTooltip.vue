<template>
  <div @mouseenter="visibilityChange($event)">
    <el-tooltip
      :content="tooltipContent"
      :disabled="!tooltipVisible"
      effect="dark"
      :placement="props.placement"
      popper-class="tooltip-popper"
    >
      <span class="tooltip-wrap">
        <slot>
          <span ref="textRef" :class="className" class="text">{{ text }}</span>
        </slot>
      </span>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { ElTooltip } from 'element-plus'
import type { Placement } from 'element-plus/es/components/popper'

export default defineComponent({
  name: 'EllipsisTooltip',
})
</script>

<script lang="ts" setup>
interface Props {
  text?: string
  content?: string
  placement?: Placement
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  content: '',
  placement: 'top',
  className: 'text',
})

const textRef = ref()
const tooltipVisible = ref(false)

const tooltipContent = computed(() => {
  const { content } = props
  return !content ? props.text : content
})

const visibilityChange = (event: Event) => {
  const ev = event.target as HTMLElement
  const containerHeight = ev.offsetHeight
  const textHeight = textRef.value?.offsetHeight
  tooltipVisible.value = textHeight && containerHeight < textHeight
}
</script>

<style lang="scss" scoped>
.tooltip-wrap {
  display: inline-block;
  display: -webkit-box;
  line-height: inherit;
  word-break: break-all;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
  -moz-text-overflow: ellipsis;
  white-space: nowrap;
}
span.text {
  white-space: initial;
}
</style>

<style lang="scss">
.tooltip-popper {
  max-width: 400px !important;
}
</style>