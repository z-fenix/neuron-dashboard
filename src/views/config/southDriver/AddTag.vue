<template>
  <div class="add-tag">
    <el-card >
      <h3 class="card-title">{{ $t('config.addTags') }}</h3>
    </el-card>

    <!-- table -->
    <el-card >
      <TagListForm
        ref="tagFormRef"
        :data="formData"
        :node-plugin-info="nodePluginInfo"
        @deleteTagItem="deleteTagItem"
      />
      <el-button class="btn-add-tag" @click="addTagItem" :icon="Plus">
               <span>{{ $t('common.add') }}</span>
      </el-button>
    </el-card>

    <el-card  class="footer add-tag-ft">
      <el-button type="primary" @click="submit" :disabled="formData.tagList.length === 0" :loading="isSubmitting">{{
        $t('common.create')
      }}</el-button>
      <el-button @click="cancel">{{ $t('common.cancel') }}</el-button>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import TagListForm from './components/TagListForm.vue'
import useAddTag from '@/composables/config/useAddTag'
import { Plus } from '@element-plus/icons-vue'
const { nodePluginInfo, formData, isSubmitting, addTagItem, deleteTagItem, tagFormRef, cancel, submit } = useAddTag()
</script>

<style lang="scss">
.add-tag {
  .el-card {
    margin-bottom: 24px;
  }
  .card-title {
    margin-bottom: 0;
  }
  .tag-num {
    margin-bottom: 0;
  }
  .tag-num-input {
    width: 280px;
  }
  .tag-item-index {
    line-height: 1.5;
    opacity: 0.6;
  }
  .tag-item-hd {
    margin-bottom: 12px;
  }
  .tag-item {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
  .add-tag-ft {
    text-align: center;
    .el-button {
      width: 130px;
    }
  }
  .btn-add-tag {
    width: 100%;
    margin-top: 32px;
    letter-spacing: 6px;
    .iconfont {
      margin-right: 10px;
    }
  }
}
</style>
