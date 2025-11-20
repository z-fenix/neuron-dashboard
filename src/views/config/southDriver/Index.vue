<template>
  <el-card v-loading="isListLoading">
    <ViewHeaderBar>
      <template v-slot:left>
        <el-button type="primary"  :icon="Plus" class="header-item btn" @click="addConfig">
          {{ $t('config.addDevice') }}
        </el-button>
      </template>
      <template v-slot:right>
        <PluginListSelector
          v-model="queryKeyword.plugin"
          :type="DriverDirection.South"
          class="header-item"
          @change="dbGetSouthDriverList"
        />
        <KeywordSerachInput
          v-model="queryKeyword.node"
          class="header-item"
          @input="dbGetSouthDriverList"
          @clear="dbGetSouthDriverList"
          @enter="dbGetSouthDriverList"
        />
        <ListCardSwitch v-model="showType" @change="changeListShowMode" />
      </template>
    </ViewHeaderBar>

    <el-empty v-if="!isListLoading && southDriverList.length === 0 && !isSwitchListLoading" class="empty" />
    <div v-else>
      <!-- card show -->
      <ul v-if="showType === 'card'" class="setup-list">
        <el-row :gutter="24">
          <el-col :span="8" v-for="(item, index) in southDriverList" :key="item.name" tag="li" class="setup-item">
            <SouthDriveItemCard
              :data="item"
              @toggle-status="setNodeStartStopStatus(item, $event, index)"
              @clickOperation="handleClickOperator($event, item)"
            />
          </el-col>
        </el-row>
      </ul>

      <!-- table show -->
      <el-table
        v-if="showType === 'list'"
        :data="southDriverList"
        :empty-text="$t('common.emptyData')"
        :row-class-name="'table-row-click'"
        :default-sort="{ prop: sortBy.prop, order: `${sortBy.order}ending` }"
        @sort-change="sortDataByKey"
        @row-click="goGroupPage"
      >
        <el-table-column :label="$t('common.name')" prop="name" sortable="custom" show-overflow-tooltip>
          <template #default="{ row }">
            <el-link type="primary" :underline="false" href="javascript:;" @click="goGroupPage(row)">
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
        <el-table-column :label="$t('config.delayTime')">
          <template #default="{ row }"> {{ row.rtt }} {{ $t('common.ms') }} </template>
        </el-table-column>
        <el-table-column :label="$t('config.plugin')" prop="plugin" sortable="custom" />
        <el-table-column align="left" :label="$t('common.oper')" width="180px">
          <template #default="{ row, index }">
            <div class="operator-wrap">
              <AComWithDesc :content="countNodeStartStopStatus(row) ? $t('common.stop') : $t('common.start')">
                <el-icon   @click.stop="setNodeStartStopStatus(row, !countNodeStartStopStatus(row), index)">
                  <VideoPause v-if="countNodeStartStopStatus(row)"/>
                  <VideoPlay v-else/>
                </el-icon>
              </AComWithDesc>
              <AComWithDesc :content="$t('config.deviceConfig')">
                <el-icon @click.stop="goNodeConfig(row)"><Setting /></el-icon>
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
                    <el-dropdown-item class="operation-item-wrap" command="delete">
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
      <el-pagination
        v-if="pageController.total > 30"
        layout="total, sizes, prev, pager, next, jumper"
        v-model:current-page="pageController.pageNum"
        :page-sizes="[30, 60, 90]"
        :total="pageController.total"
        :page-size="pageController.pageSize"
        class="pagination"
        @current-change="getAPageTagData"
        @size-change="handleSizeChange"
      />
    </div>
  </el-card>

  <!-- Data Statistics -->
  <DataStatisticsDrawer
    v-if="dataStatisticsVisiable"
    v-model="dataStatisticsVisiable"
    :type="NodeCatogery.South"
    :node-name="nodeItemData.name"
  />

  <DriverDialog
    v-model="showDialog"
    :type="DriverDirection.South"
    :is-dual-mode="true"
    @submitted="getSouthDriverList"
  />

  <EditNodeNameDialog
    v-model="showEditDialog"
    :type="DriverDirection.South"
    :node-name="editDriverData.name"
    :node="editDriverData"
    @updated="reloadDriverList"
  />

  <!-- check license -->
  <LicenseTipDialog
    v-model="licenseTipVisible"
    :isHasLicense="isHasLicense"
    :isLicenseInvalid="isLicenseInvalid"
    :isLicenseExpiry="isLicenseExpiry"
    :isLicenseReadyExpiry="isLicenseReadyExpiry"
    :isHardwareMismatch="isHardwareMismatch"
    :isOverMaximumNodes="isOverMaximumNodes"
    :isOverMaximumTags="isOverMaximumTags"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import store from '@/store'
import { ElLink } from 'element-plus'
import {
  useToggleNodeStartStopStatus,
  useDriverStatus,
  useNodeStartStopStatus,
  dataStatistics,
  useListShowType,
  useDriverName,
} from '@/composables/config/useDriver'
import { Plus,Edit,Delete,VideoPause,VideoPlay,Setting,MoreFilled } from '@element-plus/icons-vue'
import useSouthDriver from '@/composables/config/useSouthDriver'
import type { DriverItemInList } from '@/types/config'
import { DriverDirection, NodeCatogery } from '@/types/enums'
import DriverDialog from '@/views/config/components/DriverDialog.vue'
import EditNodeNameDialog from '@/views/config/components/EditNodeNameDialog.vue'
import SouthDriveItemCard from './components/SouthDriveItemCard.vue'
import ViewHeaderBar from '@/components/ViewHeaderBar.vue'
import KeywordSerachInput from '@/components/KeywordSearchInput.vue'
import PluginListSelector from '../components/PluginListSelector.vue'
import ListCardSwitch from '@/components/ListCardSwitch.vue'
import AComWithDesc from '@/components/AComWithDesc.vue'
import DataStatisticsDrawer from '../components/DataStatisticsDrawer.vue'
import { isTheSameParentRoute } from '@/utils/utils'
import useCheckLicense from '@/composables/useCheckLicense'
import LicenseTipDialog from '@/components/LicenseTipDialog.vue'
import Cookies from 'js-cookie'

export default defineComponent({
  beforeRouteEnter(to:any, from:any, next:any) {
    const isSameParentRoute = isTheSameParentRoute(from, to)
    if (!isSameParentRoute) {
      const paginationData = { pageNum: 1, pageSize: 30, total: 0 }
      store.commit('SET_PAGINATION', paginationData)
      store.commit('SET_LIST_SHOW_TYPE', 'list')
    }
    next()
  },
})
</script>

<script lang="ts" setup>
const {
  queryKeyword,
  pageController,
  getAPageTagData,
  handleSizeChange,
  southDriverList,
  isListLoading,
  getSouthDriverList,
  dbGetSouthDriverList,
  reloadDriverList,

  goGroupPage,
  goNodeConfig,
  deleteDriver,
  modifyNodeLogLevel,

  sortBy,
  sortDataByKey,
  isSwitchListLoading,
  changeListShowMode,

  addConfig,
  showDialog,
  editDialog,
  showEditDialog,
  editDriverData,
} = useSouthDriver(true, true)

const { isShowDataStatistics, dataStatisticsVisiable, nodeItemData } = dataStatistics()

const { showType } = useListShowType()

const { toggleNodeStartStopStatus } = useToggleNodeStartStopStatus()
const { countNodeStartStopStatus } = useNodeStartStopStatus()

const setNodeStartStopStatus = async (node: DriverItemInList, status: boolean, nodeIndex: number) => {
  try {
    const ret = await toggleNodeStartStopStatus(node, status)
    if (typeof ret === 'object') {
      southDriverList.value.splice(nodeIndex, 1, ret)
    } else {
      getSouthDriverList()
    }
  } catch (error) {
    console.error(error)
  }
}

const getNodeValue = (node: DriverItemInList) => {
  const useDriverStatusSet = useDriverStatus({ data: node })
  return useDriverStatusSet
}

const { isMonitorNode } = useDriverName()

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

const {
  checkLicense,
  licenseTipVisible,
  isHasLicense,
  isTrialLicense,
  isLicenseExpiry,
  isLicenseReadyExpiry,
  isLicenseInvalid,
  isHardwareMismatch,
  isOverMaximumNodes,
  isOverMaximumTags,
} = useCheckLicense()

const isShowLicenseTip = Cookies.get('licenseTipVisible')
if (isShowLicenseTip !== 'false') {
  checkLicense()
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
  width: 28px;
}
</style>
