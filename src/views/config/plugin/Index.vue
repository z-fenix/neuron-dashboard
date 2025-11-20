<template>
  <el-card class="plugin" v-loading="isListLoading">
    <ViewHeaderBar>
      <template v-slot:left>
        <el-button type="primary" :icon="Plus" class="header-item btn" @click="addPlugin">
          {{ $t('config.addPlugin') }}
        </el-button>
      </template>
      <template v-slot:right>
        <el-select
          v-model="filterNodeType"
          size="large"
          clearable
          :placeholder="$t('common.pleaseSelect')"
          class="header-item filter-item"
        >
          <el-option v-for="item in nodeTypeList" :key="item.value" :value="item.value" :label="item.label" />
          <el-option :value="ALL_KEY" :label="$t('config.all')"></el-option>
        </el-select>
      </template>
    </ViewHeaderBar>

    <ul class="setup-list">
      <el-row :gutter="24">
        <el-col :span="8" v-for="item in listToShow" :key="item.name" tag="li" class="setup-item">
          <PluginItemCard :data="item" @deleted="getPluginList" @edit="editPlugin(item)" />
        </el-col>
      </el-row>
    </ul>
    <el-empty v-if="!isListLoading && listToShow.length === 0" />
  </el-card>
  <PluginDialog v-model="showDialog" :plugin="currentPlugin" @submitted="getPluginList" />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useNodeTypeSelect } from '@/composables/config/useDriver'
import usePlugin from '@/composables/config/usePlugin'
import type { CreatedPlugin } from '@/types/config'
import { DriverDirection, PluginKind } from '@/types/enums'
import { NORTH_DRIVER_NODE_TYPE, SOUTH_DRIVER_NODE_TYPE } from '@/utils/constants'
import type { Ref } from 'vue'
import PluginDialog from './components/PluginDialog.vue'
import PluginItemCard from './components/PluginItemCard.vue'
import ViewHeaderBar from '@/components/ViewHeaderBar.vue'

const { pluginList, isListLoading, getPluginList } = usePlugin()
const { nodeTypeList } = useNodeTypeSelect()
const filterNodeType = ref(null)
const currentPlugin: Ref<undefined | CreatedPlugin> = ref(undefined)
const showDialog = ref(false)
const ALL_KEY = 'all'

const listNeedShow = computed(() => {
  return pluginList.value.filter(({ kind }) => {
    return kind !== PluginKind.Static
  })
})

const listToShow = computed(() => {
  if (!filterNodeType.value || filterNodeType.value === ALL_KEY) {
    return listNeedShow.value
  }
  return listNeedShow.value.filter(({ node_type }) =>
    filterNodeType.value === DriverDirection.South
      ? SOUTH_DRIVER_NODE_TYPE.some((typeItem) => typeItem === node_type)
      : NORTH_DRIVER_NODE_TYPE.some((typeItem) => typeItem === node_type),
  )
})

const addPlugin = () => {
  currentPlugin.value = undefined
  showDialog.value = true
}
const editPlugin=(row:any)=>{
  row.id
}
</script>

<style lang="scss" scoped>
.plugin {
  .filter-item {
    width: 220px;
  }
  .setup-list {
    list-style: none;
    margin-top: 6px;
    .setup-item {
      margin-bottom: 24px;
    }
  }

  :deep(.el-select) {
    .el-icon-circle-close {
      font-size: 16px;
    }
  }
}
</style>
