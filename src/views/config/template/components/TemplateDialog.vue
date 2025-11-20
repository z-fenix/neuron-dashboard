<template>
  <el-dialog v-model="showDialog" :width="500" custom-class="common-dialog" :title="dialogTitle" :z-index="2000">
    <el-form ref="formRef" label-position="top" :model="templateForm" :rules="rules">
      <el-form-item prop="name" :label="$t('common.name')" required>
        <el-input v-model.trim="templateForm.name" />
      </el-form-item>
      <el-form-item prop="plugin" :label="$t('config.plugin')" required>
        <!-- :types="SOUTH_DRIVER_NODE_TYPE" -->
        <PluginListSelector
          v-model="templateForm.plugin"
          :type="DriverDirection.South"
          :disabled="isEdit || isImport"
          width="100%"
          :placeholder="$t('config.selectPlugin')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" size="small" @click="submit" :loading="isSubmitting">
          {{ $t('common.create') }}
        </el-button>
        <el-button size="small" @click="cancel">{{ $t('common.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, defineProps, defineEmits, watch, nextTick } from 'vue'
import type { PropType } from 'vue'
import { ElDialog } from 'element-plus'
import useTemplateDialog from '@/composables/config/useTemplateDialog'
import PluginListSelector from '@/views/config/components/PluginListSelector.vue'
import type { TemplateFormData } from '@/types/config'
import { DriverDirection } from '@/types/enums'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  isImport: {
    type: Boolean,
    default: false,
  },
  templateData: {
    type: Object as PropType<TemplateFormData>,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'submitted', 'cancel'])

const { formRef, templateForm, dialogTitle, isSubmitting, rules, initForm, submitData } = useTemplateDialog(props)

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

watch(showDialog, (val) => {
  nextTick(() => {
    formRef.value.form?.clearValidate()
  })
  if (!val) {
    initForm()
    emit('cancel')
  }
})

const submit = async () => {
  try {
    await submitData()
    showDialog.value = false
    emit('submitted')
  } catch (error) {
    console.error(error)
  }
}
const cancel = () => {
  showDialog.value = false
}
</script>
