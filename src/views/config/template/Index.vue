<template>
  <el-card v-loading="isListLoading">
    <ViewHeaderBar class="tempalte-remark">
      <template v-slot:left>
        <span class="header-item">{{ $t('template.templateRemark') }}</span>
      </template>
      <template v-slot:right>
        <!-- TODO: support when template usage document is ready-->
        <!-- <el-link type="primary" :underline="false" href="javascript:;" class="header-item">
          <i class="el-icon-document"></i>
          {{ $t('template.templateLink') }}
        </el-link> -->
      </template>
    </ViewHeaderBar>

    <ViewHeaderBar>
      <template v-slot:left>
        <el-button
          type="primary"
          :icon="Plus"
          class="header-item btn"
          @click="showTemplateDialog"
        >
          {{ $t('template.addTemplate') }}
        </el-button>
      </template>
      <template v-slot:right>
        <el-dropdown :hide-timeout="512" popper-class="btn-download-temp-popper">
          <el-upload
            action=""
            :before-upload="importFile"
            :show-file-list="false"
            :accept="'application/json'"
            class="uploader"
          >
            <el-button size="small" class="header-item btn">
              <i class="iconfont icon-import icondownload"></i>
              <span>{{ $t('template.importTemplate') }}</span>
            </el-button>
          </el-upload>
        </el-dropdown>
      </template>
    </ViewHeaderBar>

    <el-empty v-if="!isListLoading && templateList.length === 0" class="empty" />
    <el-table
      v-else
      :data="templateList"
      :empty-text="$t('common.emptyData')"
      :row-class-name="'table-row-click'"
      @row-click="goGroupPage"
    >
      <el-table-column :label="$t('common.name')" prop="name" show-overflow-tooltip>
        <template #default="{ row }">
          <el-link type="primary" :underline="false" href="javascript:;" @click="goGroupPage(row)">
            {{ row.name }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column :label="$t('config.plugin')" prop="plugin" />
      <el-table-column align="left" :label="$t('common.oper')" width="220px">
        <template #default="{ row }">
          <div class="operator-wrap">
            <!-- TODO -->
            <!-- <AComWithDesc :content="$t('common.edit')">
              <i class="el-icon-edit-outline" @click.stop="editTemplate(row)" />
            </AComWithDesc> -->
            <AComWithDesc :content="$t('common.export')">
              <i class="iconfont icon-import iconsubmit" @click.stop="exportTemplate(row)" />
            </AComWithDesc>
            <AComWithDesc :content="$t('common.delete')">
              <i class="iconfont icondelete" @click.stop="removeTemplate(row)" />
            </AComWithDesc>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- add | edit | import -->
  <TemplateDialog
    v-model="templateDialogVisible"
    :isEdit="isEditTemplate"
    :isImport="isImportTemplate"
    :templateData="editTemplateData"
    @submitted="getTemplateList"
    @cancel="cancelOperateTemplate"
  />
</template>

<script lang="ts" setup>
import { ElLink } from 'element-plus'
import AComWithDesc from '@/components/AComWithDesc.vue'
import ViewHeaderBar from '@/components/ViewHeaderBar.vue'
import useTemplateList from '@/composables/config/useTemplateList'
import TemplateDialog from './components/TemplateDialog.vue'
import { Plus } from '@element-plus/icons-vue'
const {
  templateList,
  isListLoading,
  getTemplateList,
  templateDialogVisible,
  showTemplateDialog,
  goGroupPage,
  exportTemplate,
  removeTemplate,
  importFile,
  isImportTemplate,
  editTemplateData,
  isEditTemplate,
  cancelOperateTemplate,
} = useTemplateList()
</script>

<style lang="scss" scoped>
.tempalte-remark {
  margin-bottom: 4px;
  color: var(--main-label-color);
}
</style>
