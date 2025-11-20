<template>
  <el-card class="north-driver-group" v-loading="isListLoading">
    <h3 class="card-title">{{ $t('config.groupList') }}</h3>
    <div class="card-bar-under-title common-flex">
      <div class="bar-left common-flex">
        <p class="driver-name">
          <label>{{ $t('config.appName') }}</label>
          <span>{{ node }}</span>
          <!-- <i class="el-icon-edit icon-edit" :title="$t('common.edit')" @click="editNodeName" /> -->
        </p>
      </div>
      <div class="btns common-flex">
        <div class="btn-group">
          <el-button size="small" type="primary" @click="addSubscription">
            {{ $t('config.addSubscription') }}
          </el-button>
          <el-button size="small" type="warning" :disabled="!subscriptionList.length" @click="clearSubscription">{{
            $t('common.clear')
          }}</el-button>
          <el-button size="small" type="danger" :disabled="!subCheckedList.length" @click="batchUnsubscribeGroups">{{
            $t('common.delete')
          }}</el-button>
        </div>
      </div>
    </div>
    <el-table :data="subscriptionList" :empty-text="$t('common.emptyData')">
      <el-table-column :width="28">
        <template #header>
          <el-checkbox v-model="allChecked" />
        </template>
        <template #default="{ row }">
          <el-checkbox v-model="row.checked" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.No')" :width="60" type="index">
      </el-table-column>
      <el-table-column :label="$t('config.groupName')" prop="group"></el-table-column>
      <el-table-column :label="$t('config.deviceName')" prop="name">
        <template #default="{ row }">{{ row.driver }}</template>
      </el-table-column>
      <el-table-column v-if="isMQTTPugin" :label="$t('config.topic')" show-overflow-tooltip>
        <template #default="{ row }">{{ row?.params?.topic }}</template>
      </el-table-column>
      <el-table-column v-if="isGewuPugin" label="productKey">
        <template #default="{ row }">{{ row?.params?.productKey }}</template>
      </el-table-column>
      <el-table-column align="left" :label="$t('common.oper')" width="140px">
        <template #default="{ row }">
          <AComWithDesc v-if="isMQTTPugin || isGewuPugin" :content="$t('common.edit')">
            <i class="el-icon-edit-outline" @click.stop="showEditGroupDialog(row)" />
          </AComWithDesc>
          <AComWithDesc :content="$t('config.unsubscribe')">
            <i class="iconfont icondelete" @click="unsubscribeGroup(row)" />
          </AComWithDesc>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <AddSubscriptionDialog v-model="showAddSubscriptionDialog" :current-node="node" @submitted="getSubscriptionList" />

  <EditSubcriptionGroup
    v-model="editGroupForm"
    v-model:dialog-visible="showEditGroupDailog"
    :is-edit="isEditGroup"
    :is-submitting="isSubmitting"
    @submitted="updateGroup"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useSubscriptionList } from '@/composables/config/useSubscription'
import { useDriverInfo } from '@/composables/config/useDriver'
import AddSubscriptionDialog from './components/AddSubscriptionDialog.vue'
import AComWithDesc from '@/components/AComWithDesc.vue'
import EditSubcriptionGroup from './components/EditSubcriptionGroup.vue'
import { DriverDirection } from '@/types/enums'

const { isMQTTPugin, isGewuPugin } = useDriverInfo()

const {
  node,
  subscriptionList,
  subCheckedList,
  isListLoading,
  allChecked,

  unsubscribeGroup,
  clearSubscription,
  batchUnsubscribeGroups,
  getSubscriptionList,

  isEditGroup,
  showEditGroupDailog,
  editGroupForm,
  showEditGroupDialog,
  updateGroup,
  isSubmitting,
} = useSubscriptionList()

const showAddSubscriptionDialog = ref(false)

const addSubscription = () => {
  showAddSubscriptionDialog.value = true
}
</script>

<style lang="scss">
.north-driver-group {
  .driver-name {
    margin-right: 22px;
  }
  .icon-edit {
    margin-left: 8px;
  }
  .btn-group {
    &:not(:last-child) {
      margin-right: 32px;
    }
  }
}
</style>
