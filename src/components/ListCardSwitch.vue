<template>
  <el-radio-group v-model="type"  @change="changeType" style="margin-bottom: 8px;">
    <el-radio-button label="list">
      <el-icon :size="18"><List /></el-icon>
    </el-radio-button>
    <el-radio-button label="card">
      <el-icon :size="18"><Menu /></el-icon>
    </el-radio-button>
  </el-radio-group>
</template>

<script lang="ts" setup>
import { computed, defineProps, defineEmits } from 'vue'
import { ElRadioGroup, ElRadioButton } from 'element-plus'
import {List, Menu} from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: { type: String, default: 'list' },
})
const emits = defineEmits(['update:modelValue', 'change'])

const type = computed({
  get: () => props.modelValue,
  set: (val) => {
    emits('update:modelValue', val)
  },
})

const changeType = (val: any) => {
  type.value = val
  emits('change', val)
}
</script>

<style lang="scss" scoped>
@import '@/styles/ui-variables.scss';

:deep(label) {
  margin-right: 0px;
}

:deep(.el-radio-button__inner) {
  padding: 8px 12px;
  .icon-item {
    font-size: 20px;
  }
}
:deep(.is-active .el-radio-button__inner) {
  color: $--color-primary;
  background-color: rgba($--color-primary, 0.1);
  border-color: #bae1ff;
}
:deep(.el-radio-button) {
  &:last-child.is-active .el-radio-button__inner {
    box-shadow: -1px 0 0 0px #bae1ff;
  }
}
</style>
