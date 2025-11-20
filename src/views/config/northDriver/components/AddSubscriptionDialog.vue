<template>
  <el-dialog
    v-model="showDialog"
    :width="600"
    custom-class="common-dialog"
    :title="$t('config.addSubscription')"
    :z-index="2000"
  >
    <el-alert v-if="topicWarning" :title="topicWarning" type="warning" show-icon :closable="false" />

    <el-form ref="formCom" :model="subscriptionForm" label-position="top" :rules="rules">
      <section v-if="!isSupportBatchSub">
        <el-form-item prop="driver" :label="$t('config.southDevice')">
          <el-select
            v-model="subscriptionForm.driver"
            filterable
            :placeholder="$t('common.pleaseSelect')"
            @change="selectedNodeChanged"
          >
            <el-option v-for="{ name } in deviceList" :key="name" :value="name" :label="name" />
          </el-select>
        </el-form-item>
        <el-form-item prop="group" :label="$t('config.group')">
          <el-select v-model="subscriptionForm.group" filterable :placeholder="$t('common.pleaseSelect')">
            <el-option v-for="{ name } in groupList" :key="name" :value="name" :label="name" />
          </el-select>
        </el-form-item>
      </section>

      <!-- mqtt -->
      <el-form-item v-if="isMQTTPugin" prop="topic" :label="$t('config.topic')">
        <el-input v-model="subscriptionForm.topic" />
      </el-form-item>

      <!-- gewu -->
      <el-form-item v-if="isGewuPugin" prop="productKey" label="productKey">
        <el-input v-model="subscriptionForm.productKey" />
      </el-form-item>

      <el-form-item v-if="isSupportBatchSub" prop="driverGroups" :label="$t('config.subscribeSouthDriverData')">
        <SouthGroupsCheckbox v-model="subscriptionForm.driverGroups" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" size="small" @click="submit" :loading="isSubmitting">
          {{ $t('common.submit') }}
        </el-button>
        <el-button size="small" @click="showDialog = false">{{ $t('common.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, defineProps, defineEmits, watch } from 'vue'
import { ElDialog, ElAlert } from 'element-plus'
import { useAddSubscription } from '@/composables/config/useSubscription'
import { useDriverInfo } from '@/composables/config/useDriver'
import SouthGroupsCheckbox from '@/views/config/components/SouthGroupsCheckbox.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  currentNode: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue', 'submitted'])

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})
const {
  formCom,
  rules,
  topicWarning,
  subscriptionForm,
  deviceList,
  groupList,
  isSubmitting,

  initForm,
  selectedNodeChanged,
  submitData,
} = useAddSubscription(props)

const { isMQTTPugin, isGewuPugin, isSupportBatchSub } = useDriverInfo()

const submit = async () => {
  await submitData()
  showDialog.value = false
  emit('submitted')
}

watch(showDialog, (val) => {
  if (val) {
    initForm()
  } else {
    formCom.value?.resetFields()
    groupList.value = []
  }
})
</script>

<style lang="scss" scoped>
:deep {
  .auto-selector {
    display: block;
    width: 100%;
  }
}
</style>
