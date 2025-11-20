<template>
  <el-dialog
    v-model="showDialog"
    :width="500"
    custom-class="common-dialog"
    :title="$t(`${dialogTitle}`)"
    :z-index="2000"
  >
    <el-form ref="formRef" :model="groupForm" label-position="top" :rules="groupRules">
      <el-form-item prop="group" :label="$t('config.groupName')" required>
        <el-input v-model.trim="groupForm.group" />
      </el-form-item>
      <el-form-item prop="interval" :label="$t('config.interval')" required>
        <el-input v-model.number="groupForm.interval">
          <template #append>ms</template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" size="small" :loading="isSubmitting" @click="submit">
          {{ $t(`${confirmBtnText}`) }}
        </el-button>
        <el-button size="small" @click="close">
          {{ $t('common.cancel') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits, nextTick, watch } from 'vue'
import type { PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElDialog } from 'element-plus'
import type { GroupFormDefault, GroupForm, TemplateGroupForm } from '@/types/config'

const createRawForm = (): GroupFormDefault => ({
  group: '',
  interval: null,
  new_name: '',
})

const emit = defineEmits(['update:modelValue', 'update:dialogVisible', 'submitted', 'close'])
const props = defineProps({
  modelValue: {
    type: Object as PropType<GroupFormDefault | GroupForm | TemplateGroupForm>,
    default: () => {
      return { group: '', interval: null }
    },
  },
  dialogVisible: {
    type: Boolean,
    required: true,
  },
  isEdit: { type: Boolean, deafult: false },
  isSubmitting: { type: Boolean, deafult: false },
  rules: {
    type: Object,
    default: () => ({}),
  },
})

const { t } = useI18n()

const formRef = ref()
const oldGroupName = ref('')
const groupForm = computed({
  get: () => props.modelValue,
  set: (val: GroupFormDefault) => {
    emit('update:modelValue', val)
  },
})

const groupRules = computed(() => {
  return {
    ...props.rules,
    group: [
      {
        required: true,
        message: t('config.groupNameRequired'),
      },
    ],
    interval: [
      {
        required: true,
        message: t('config.readIntervalRequired'),
      },
      {
        validator(rule: unknown, value: string) {
          const ret = []
          if (Number.isNaN(Number(value))) {
            ret.push(new Error(t('config.readIntervalError')))
          }
          return ret
        },
      },
      {
        type: 'number',
        min: 100,
        message: t('config.readIntervalMinimumError'),
        trigger: 'blur',
      },
    ],
  }
})

const dialogTitle = computed(() => {
  const title = props.isEdit ? 'config.editGroup' : 'config.createGroup'
  return title
})
const confirmBtnText = computed(() => {
  return !props.isEdit ? 'common.create' : 'common.submit'
})

const resetFields = () => {
  formRef.value.form?.resetFields()
}
const initForm = () => {
  groupForm.value = createRawForm()
}

const showDialog = computed({
  get: () => props.dialogVisible,
  set: (val: boolean) => {
    emit('update:dialogVisible', val)
  },
})

watch(showDialog, async (val) => {
  nextTick(() => {
    formRef.value.form?.clearValidate()
  })
  if (!val) {
    resetFields()
    initForm()
  }
  oldGroupName.value = props.modelValue.group
})

const submit = async () => {
  const { group, interval } = groupForm.value
  if (props.isEdit) {
    groupForm.value = {
      group: oldGroupName.value,
      new_name: group,
      interval,
    }
  }
  await formRef.value?.validate()
  emit('submitted')
}
const close = () => {
  showDialog.value = false
  emit('close')
}
</script>
