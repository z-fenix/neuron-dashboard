<template>
  <el-dialog v-model="showDialog" :width="500" custom-class="common-dialog" :title="dialogTitle" :z-index="2000">
    <el-form ref="formCom" :model="driverForm" :rules="groupFormRules" label-position="top">
      <el-form-item prop="name" :label="$t('common.name')" required>
        <el-input v-model.trim="driverForm.name" :disabled="driver" />
      </el-form-item>

      <!-- 1. Supports dual modes: plug-in and template  -->
      <el-form-item v-if="isDualMode" :label="$t('config.addDriverMode')">
        <el-radio-group v-model="activeDriverMode" class="mode-radio-group" @change="changeMode">
          <el-radio :label="addDriverModes[0]">{{ $t('config.pluginMode') }}</el-radio>
          <el-radio :label="addDriverModes[1]">{{ $t('config.templateMode') }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <!--  Plugin mode-->
      <el-form-item v-if="activeDriverMode === addDriverModes[0]" prop="plugin" :label="$t('config.plugin')" required>
        <PluginListSelector
          v-model="driverForm.plugin"
          :type="type"
          :disabled="!!driver"
          width="100%"
          :placeholder="$t('config.selectPlugin')"
        />
      </el-form-item>

      <!-- Template mode -->
      <el-form-item
        v-if="activeDriverMode === addDriverModes[1]"
        prop="template"
        :label="$t('config.templateMode')"
        required
      >
        <TemplateListSelector v-model="driverForm.template" :disabled="!!driver" width="100%" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" size="small" @click="submit" :loading="isSubmitting">
          {{ $t('common.create') }}
        </el-button>
        <el-button size="small" @click="showDialog = false">{{ $t('common.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, defineEmits, defineProps, watch, nextTick } from 'vue'
import { ElDialog } from 'element-plus'
import useDriverDialog from '@/composables/config/useDriverDialog'
import type { DriverDirection } from '@/types/enums'
import PluginListSelector from '@/views/config/components/PluginListSelector.vue'
import TemplateListSelector from '@/views/config/components/TemplateListSelector.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  type: {
    type: Number as PropType<DriverDirection>,
    required: true,
  },
  driver: {
    type: Object,
  },
  // Currently only south devices support Dual-Mode, and north apps only support plug-in mode
  isDualMode: {
    type: Boolean,
    default: false,
  },
})

const {
  dialogTitle,
  formCom,
  driverForm,
  isSubmitting,
  groupFormRules,
  initForm,
  submitData,

  addDriverModes,
  activeDriverMode,
  changeMode,
} = useDriverDialog(props.type)

const emit = defineEmits(['update:modelValue', 'submitted'])

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

watch(showDialog, (val) => {
  nextTick(() => {
    formCom.value.form?.clearValidate()
  })
  if (!val) {
    initForm()
  }
})

const submit = async () => {
  await submitData()
  showDialog.value = false
  emit('submitted')
}
</script>

<style lang="scss" scoped>
.mode-radio-group {
  width: 100%;
}
</style>
