<template>
  <div class="node-config" v-loading="isLoading">
    <el-card  class="node-config-bd">
      <h3 class="card-title">{{ cardTitle }}</h3>
      <div class="bar-left common-flex">
        <p class="driver-name">
          <label>{{ labelForNodeName }}</label>
          <span>{{ node }}</span>
        </p>
      </div>

      <el-form ref="formCom" :model="configForm" label-position="top">
        <template v-for="field in fieldList" :key="field.key">
          <el-row>
            <NodeConfigParamItem
              :ref="setParamRef"
              v-if="shouldFieldShow(field, configForm)"
              v-model="configForm[field.key]"
              :param-key="field.key"
              :param-info="field.info"
              :default-data="defaultConfigData"
              @validateFileds="validateFileds"
            />
          </el-row>
        </template>
      </el-form>

      <template v-if="!isLoading && fieldList.length === 0">
        <div class="empty-placeholder">
          <el-empty :description="$t('config.noConfigInfoDesc')" />
          <el-button @click="cancel" size="small">{{ $t('common.back') }}</el-button>
        </div>
      </template>
    </el-card>
    <el-card v-if="!isLoading && fieldList.length > 0" shadow="never" class="node-config-ft">
      <el-button type="primary" :loading="isSubmitting" @click="submit">{{ $t('common.submit') }}</el-button>
      <el-button @click="cancel">{{ $t('common.cancel') }}</el-button>
      <el-button @click.stop="reset">{{ $t('common.reset') }}</el-button>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, defineProps } from 'vue'
import useNodeConfig from '@/composables/config/useNodeConfig'
import { DriverDirection } from '@/types/enums'
import NodeConfigParamItem from './components/NodeConfigParamItem.vue'
import { useI18n } from 'vue-i18n'
import useNodeConfigParamCommon from '@/composables/config/useNodeConfigParamCommon'

const props = defineProps({
  direction: {
    type: Number as PropType<DriverDirection>,
    required: true,
  },
})

const { t } = useI18n()
const cardTitle = computed(() =>
  t(props.direction === DriverDirection.North ? 'config.appConfig' : 'config.deviceConfig'),
)
const labelForNodeName = computed(() =>
  t(props.direction === DriverDirection.North ? 'config.appName' : 'config.deviceName'),
)

const { shouldFieldShow } = useNodeConfigParamCommon()

const {
  node,
  configForm,
  defaultConfigData,
  fieldList,
  isLoading,
  formCom,
  setParamRef,
  isSubmitting,
  submit,
  cancel,
  reset,
  validateFileds,
} = useNodeConfig(props)
</script>

<style lang="scss">
.node-config {
  .node-config-ft {
    text-align: center;
    .el-button {
      width: 130px;
    }
  }
  .node-config-bd {
    margin-bottom: 24px;
    min-height: 200px;
  }
  .el-row {
    padding-top: 16px;
  }
  .el-radio-group {
    width: 100%;
  }
  .empty-placeholder {
    padding-bottom: 60px;
    text-align: center;
  }
}
</style>
