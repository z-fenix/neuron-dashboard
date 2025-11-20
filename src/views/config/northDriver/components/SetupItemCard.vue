<template>
  <div
    class="node-card setup-item-card"
    :class="{ 'row-disabled': isMonitorNode(data.name) }"
    @click="goGroupPage(data)"
  >
    <div class="node-item-hd common-flex">
      <p class="setup-item-name ellipsis">{{ data.name }}</p>
      <div class="setup-item-handlers">
        <AComWithDesc :content="$t('config.appConfig')">
          <el-icon  @click.stop="goNodeConfig(data)" style="margin-right: 8px;"><Setting /></el-icon>
        </AComWithDesc>
        <AComWithDesc :content="$t('config.dataStatistics')">
          <span @click.stop="isShowDataStatistics(data)">
            <img
              class="operation-image icon-image img-statistic-log"
              src="~@/assets/images/statistics.png"
              alt="debug-log"
            />
          </span>
        </AComWithDesc>

        <!-- monitor driver does not support deletion and editing -->
        <AComWithDesc v-if="isMonitorNode(data.name)" :content="$t('config.updateDebugLogLevel')">
          <img
            class="img-debug-log-large"
            src="~@/assets/images/debug-log-icon.png"
            alt="debug-log"
            @click.stop="handleClickOperator('debugLogLevel')"
          />
        </AComWithDesc>
        <el-dropdown v-else trigger="click" @command="handleClickOperator">
            <span class="el-dropdown-link" @click.stop>
              <AComWithDesc :content="$t('common.more')">
                <el-icon><MoreFilled /></el-icon>
              </AComWithDesc>
            </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="!isMonitorNode(data.name)" class="operation-item-wrap" command="edit">
                <el-icon class="operation-icon"><Edit/></el-icon>
                <span>{{ $t(`common.edit`) }}</span>
              </el-dropdown-item>
              <el-dropdown-item class="operation-item-wrap" command="debugLogLevel">
                <img class="operation-image" src="~@/assets/images/debug-log-icon.png" alt="debug-log" />
                <span>{{ $t(`config.updateDebugLogLevel`) }}</span>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="!isNotSupportRemoveNode(data.name)"
                class="operation-item-wrap"
                command="delete"
                :disabled="data.pluginKind === PluginKind.Static"
              >
                <el-icon class="operation-icon"><Delete/></el-icon>
                <span>{{ $t(`common.delete`) }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="node-item-info-row common-flex">
      <div class="common-flex">
        <label>{{ $t('config.workStatus') }}</label>
        <div>
          <svg class="iconfont icon-svg" aria-hidden="true">
            <use :xlink:href="`#${statusIcon}`" />
          </svg>
          <span>{{ statusText }}</span>
        </div>
      </div>
      <div class="common-flex">
        <el-switch v-model="nodeStartStopStatus" @click.stop />
      </div>
    </div>
    <div class="node-item-info-row">
      <label>{{ $t('config.connectionStatus') }}</label>
      <span>{{ connectionStatusText }}</span>
    </div>
    <div class="node-item-info-row">
      <label>{{ $t('config.plugin') }}: </label>
      <span>{{ data.plugin }}</span>
    </div>
  </div>

  <!-- Data Statistics -->
  <DataStatisticsDrawer
    v-if="dataStatisticsVisiable"
    v-model="dataStatisticsVisiable"
    :type="NodeCatogery.North"
    :node-name="data.name"
  ></DataStatisticsDrawer>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps } from 'vue'
import type { PropType } from 'vue'
import {Edit,Delete, Setting,MoreFilled } from '@element-plus/icons-vue'
import { useDriverStatus, useNodeStartStopStatus, dataStatistics, useDriverName } from '@/composables/config/useDriver'
import useNorthDriver from '@/composables/config/useNorthDriver'
import { PluginKind, NodeCatogery } from '@/types/enums'
import type { DriverItemInList } from '@/types/config'
import AComWithDesc from '@/components/AComWithDesc.vue'
import DataStatisticsDrawer from '../../components/DataStatisticsDrawer.vue'

const emit = defineEmits(['toggleStatus', 'clickOperation'])

const props = defineProps({
  data: { type: Object as PropType<DriverItemInList>, required: true },
})

const { goNodeConfig, goGroupPage } = useNorthDriver(false)
const { statusIcon, statusText, connectionStatusText } = useDriverStatus(props)

const { countNodeStartStopStatus } = useNodeStartStopStatus()

const nodeStartStopStatus = computed({
  get() {
    return countNodeStartStopStatus(props.data)
  },
  set(val) {
    emit('toggleStatus', val)
  },
})

// dataStatistics
const { isShowDataStatistics, dataStatisticsVisiable } = dataStatistics()

// more operators
const handleClickOperator = async (command: string) => {
  emit('clickOperation', command)
}

const { isNotSupportRemoveNode, isMonitorNode } = useDriverName()
</script>

<style lang="scss" scoped>
@import '~@/styles/mixins.scss';

.setup-item-card {
  background-color: #f4f9fc;
}
.setup-item-handlers {
  @include display-flex();
}
.img-debug-log-large {
  cursor: pointer;
  width: 18px;
}

.operation-item-wrap {
  display: flex;
  align-items: center;
}
.operation-icon {
  font-size: 20px;
  color: #20466c;
}
.operation-image {
  margin-right: 8px;
  position: relative;
  left: 2px;
  width: 18px;
  cursor: pointer;
}
.icon-image {
  display: inline-block;
  margin: 0 10px 0 -4px;
  width: 24px;
}
</style>
