<template>
  <el-card v-loading="isListLoading">
    <ViewHeaderBar>
      <template v-slot:left>
        <el-button type="primary"  :icon="Plus" class="header-item btn" @click="addConfig">
          {{ $t('config.addApplication') }}
        </el-button>
      </template>
      <template v-slot:right>
        <ListCardSwitch v-model="showType" @change="changeListShowMode" />
      </template>
    </ViewHeaderBar>

    <ul v-if="showType === 'card'" class="setup-list">
      <el-row :gutter="24">
        <el-col :span="8" v-for="(item, index) in northDriverList" :key="item.name" tag="li" class="setup-item">
          <SetupItemCard
            :data="item"
            @toggle-status="setNodeStartStopStatus(item, $event, index)"
            @clickOperation="handleClickOperator($event, item)"
          />
        </el-col>
      </el-row>
    </ul>

    <el-table
      v-if="showType === 'list'"
      :data="northDriverList"
      :empty-text="$t('common.emptyData')"
      :row-class-name="rowClassName"
      :default-sort="{ prop: sortBy.prop, order: `${sortBy.order}ending` }"
      @sort-change="sortDataByKey"
      @row-click="goGroupPage"
    >
      <el-table-column :label="$t('common.name')" prop="name" sortable="custom" show-overflow-tooltip>
        <template #default="{ row }">
          <span v-if="isMonitorNode(row.name)">{{ row.name }}</span>
          <el-link v-else type="primary" :underline="false" href="javascript:;" @click.stop="goGroupPage(row)">
            {{ row.name }}
          </el-link>
        </template>
      </el-table-column>
      <!--  workStatus-->
      <el-table-column :label="$t('config.workStatus')" prop="statusText" sortable="custom">
        <template #default="{ row }">
          <svg class="iconfont icon-svg" aria-hidden="true">
            <use :xlink:href="`#${getNodeValue(row).statusIcon.value}`" />
          </svg>
          {{ getNodeValue(row).statusText.value }}
        </template>
      </el-table-column>
      <!-- connectionStatus -->
      <el-table-column
        :label="$t('config.connectionStatus')"
        prop="connectionStatusText"
        sortable="custom"
        min-width="90"
      >
        <template #default="{ row }">
          {{ getNodeValue(row).connectionStatusText.value }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('config.plugin')" prop="plugin" sortable="custom" />
      <el-table-column align="left" :label="$t('common.oper')" width="180px">
        <template #default="{ row, index }">
          <div class="operator-wrap">
            <AComWithDesc :content="countNodeStartStopStatus(row) ? $t('common.stop') : $t('common.start')">
              <el-icon  class="operation-icon" @click.stop="setNodeStartStopStatus(row, !countNodeStartStopStatus(row), index)">
                  <VideoPause v-if="countNodeStartStopStatus(row)"/>
                  <VideoPlay v-else/>
                </el-icon>
            </AComWithDesc>
            <AComWithDesc :content="$t('config.appConfig')">
              <el-icon class="operation-icon" @click.stop="goNodeConfig(row)"><Setting /></el-icon>
            </AComWithDesc>

            <AComWithDesc :content="$t('config.dataStatistics')">
              <span @click.stop="handleClickOperator('dataStatistics', row)">
                <img
                  :size="18"
                  class="operation-image icon-image img-statistic-log"
                  src="~@/assets/images/statistics.png"
                  alt="debug-log"
                />
              </span>
            </AComWithDesc>

            <el-dropdown trigger="click" @command="handleClickOperator($event, row)">
                <span class="el-dropdown-link" @click.stop>
                  <AComWithDesc :content="$t('common.more')">
                    <el-icon><MoreFilled /></el-icon>
                  </AComWithDesc>
                </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="!isMonitorNode(row.name)" class="operation-item-wrap" command="edit">
                    <el-icon class="operation-icon"><Edit/></el-icon>
                    <span>{{ $t(`common.edit`) }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item class="operation-item-wrap" command="debugLogLevel">
                    <img
                      class="operation-image img-debug-log"
                      src="~@/assets/images/debug-log-icon.png"
                      alt="debug-log"
                    />
                    <span>{{ $t(`config.updateDebugLogLevel`) }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="!isNotSupportRemoveNode(row.name)"
                    command="delete"
                    class="operation-item-wrap"
                  >
                    <el-icon class="operation-icon"><Delete/></el-icon>
                    <span>{{ $t(`common.delete`) }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!isListLoading && northDriverList.length === 0" />
  </el-card>

  <DriverDialog v-model="showDialog" :type="DriverDirection.North" @submitted="getNorthDriverList" />

  <!-- Data Statistics -->
  <DataStatisticsDrawer
    v-if="dataStatisticsVisiable"
    v-model="dataStatisticsVisiable"
    :type="NodeCatogery.North"
    :node-name="nodeItemData.name"
  />

  <EditNodeNameDialog
    v-model="showEditDialog"
    :type="DriverDirection.North"
    :node-name="editDriverData.name"
    :node="editDriverData"
    @updated="reloadDriverList"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import store from '@/store'
import { useI18n } from 'vue-i18n'
import { ElLink } from 'element-plus'
import {
  useToggleNodeStartStopStatus,
  useDriverStatus,
  useNodeStartStopStatus,
  dataStatistics,
  useListShowType,
  useDriverName,
} from '@/composables/config/useDriver'
import useNorthDriver from '@/composables/config/useNorthDriver'
import type { DriverItemInList } from '@/types/config'
import { DriverDirection, NodeCatogery } from '@/types/enums'
import DriverDialog from '@/views/config/components/DriverDialog.vue'
import EditNodeNameDialog from '@/views/config/components/EditNodeNameDialog.vue'
import SetupItemCard from './components/SetupItemCard.vue'
import { ElMessage } from 'element-plus'
import { Plus,Edit,Delete,VideoPause,VideoPlay,Setting,MoreFilled } from '@element-plus/icons-vue'
import ViewHeaderBar from '@/components/ViewHeaderBar.vue'
import ListCardSwitch from '@/components/ListCardSwitch.vue'
import AComWithDesc from '@/components/AComWithDesc.vue'
import DataStatisticsDrawer from '../components/DataStatisticsDrawer.vue'
import { isTheSameParentRoute } from '@/utils/utils'

export default defineComponent({
  beforeRouteEnter(to:any, from:any, next:any) {
    const isSameParentRoute = isTheSameParentRoute(from, to)
    if (!isSameParentRoute) {
      store.commit('SET_LIST_SHOW_TYPE', 'list')
    }
    next()
  },
})
</script>

<script lang="ts" setup>
const { t } = useI18n()
const {
  northDriverList,
  isListLoading,
  getNorthDriverList,
  reloadDriverList,

  goGroupPage,
  goNodeConfig,
  modifyNodeLogLevel,
  deleteDriver,

  sortBy,
  sortDataByKey,
  changeListShowMode,

  addConfig,
  showDialog,
  editDialog,
  showEditDialog,
  editDriverData,
} = useNorthDriver(true, true)

const { isShowDataStatistics, dataStatisticsVisiable, nodeItemData } = dataStatistics()
const { isNotSupportRemoveNode, isMonitorNode } = useDriverName()

const { showType } = useListShowType()

const { toggleNodeStartStopStatus } = useToggleNodeStartStopStatus()
const { countNodeStartStopStatus } = useNodeStartStopStatus()

const setNodeStartStopStatus = async (node: DriverItemInList, status: boolean, nodeIndex: number) => {
  try {
    const ret = await toggleNodeStartStopStatus(node, status)
    const message = status ? t('config.runSuc') : t('config.stopSuc')
    ElMessage.success(message)
    if (typeof ret === 'object') {
      northDriverList.value.splice(nodeIndex, 1, ret)
    } else {
      getNorthDriverList()
    }
  } catch (error) {
    console.error(error)
  }
}

const getNodeValue = (node: DriverItemInList) => {
  const useDriverStatusSet = useDriverStatus({ data: node })
  return useDriverStatusSet
}

const rowClassName = (data: { row: DriverItemInList; rowIndex: number }) => {
  const { row: node } = data
  return isMonitorNode(node.name) ? 'row-disabled' : 'table-row-click'
}

const handleClickOperator = async (command: string, row: DriverItemInList) => {
  const apiMap = new Map([
    ['edit', editDialog],
    ['dataStatistics', isShowDataStatistics],
    ['debugLogLevel', modifyNodeLogLevel],
    ['delete', deleteDriver],
  ])
  const apiFunc = apiMap.get(command)
  if (apiFunc && typeof apiFunc === 'function') {
    apiFunc(row)
  }
}
</script>

<style lang="scss" scoped>
.setup-list {
  list-style: none;
  margin-top: 6px;

  .setup-item {
    margin-bottom: 24px;
  }
}

.operation-item-wrap {
  display: flex;
  align-items: center;
}
.operation-icon {
  font-size: 24px;
  color: #20466c;
}
.operation-image {
  margin-right: 8px;
  position: relative;
  left: 2px;
  width: 22px;
  cursor: pointer;
}
.icon-image {
  display: inline-block;
  margin: 0 10px 0 -6px;
  width: 24px;
}

:deep(.row-disabled) {
  cursor: not-allowed;
}
</style>
