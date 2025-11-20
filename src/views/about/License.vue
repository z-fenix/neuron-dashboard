<template>
  <el-card v-loading="isDataLoading">
    <div class="card-hd-with-btn">
      <h3 class="card-title">{{ $t('admin.license') }}</h3>
    </div>
    <div class="license">
      <el-descriptions v-if="hasLicense" :column="1">
        <!-- <el-descriptions-item :label="$t('admin.licenseType')">
          {{ licenseData.license_type }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('admin.licenseStatus')">
          {{ licenseStatus }}
        </el-descriptions-item> -->
        <!-- <el-descriptions-item :label="$t('admin.object')"> -->
        <el-descriptions-item :label="$t('admin.object')">
          {{ licenseData.object }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('admin.nodeUsage')">
          <el-progress :stroke-width="14" :percentage="licenseData.nodesUsage" status="success" class="progress-bar">
            <span class="progress-text">{{ licenseData.used_nodes }} / {{ licenseData.max_nodes }}</span>
          </el-progress>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('admin.tagUsage')">
          <el-progress :stroke-width="14" :percentage="licenseData.tagsUsage" status="success" class="progress-bar">
            <span class="progress-text">{{ licenseData.used_tags }} / {{ licenseData.max_node_tags }}</span>
          </el-progress>
        </el-descriptions-item>

        <!-- <el-descriptions-item :label="$t('admin.maxNodes')">
          {{ licenseData.max_nodes }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('admin.usedNodes')">
          {{ licenseData.used_nodes }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('admin.maxNodeTags')">
          {{ licenseData.max_node_tags }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('admin.usedTags')">
          {{ licenseData.used_tags }}
        </el-descriptions-item> -->
        <el-descriptions-item :label="$t('admin.emailAddress')">
          {{ licenseData.email_address }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('admin.effectiveDate')">
          {{ licenseData.valid_since }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('admin.expireDate')">
          {{ licenseData.valid_until }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('admin.enabledPlugins')">
          {{ pluginsStr }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('admin.hardwareToken')">
          {{ licenseData.hardware_token || '-' }}
        </el-descriptions-item>
      </el-descriptions>
      <div class="msg" :class="{ 'align-center': !hasLicense }">
        <img v-if="!hasLicense" :src="require('@/assets/images/license.png')" width="400" />
        <div class="method-text">
          <p>{{ hasLicense ? $t('admin.howToGetTheCertificate') : $t('admin.licensePlaceholder') }}</p>
          <p>
            1.
            <i18n-t class="payload-desc" keypath="admin.getFreeLicense" tag="span">
              <a :href="licenseLink" target="_blank">{{ $t('admin.apply') }}</a>
            </i18n-t>
          </p>
          <p>
            2.
            <i18n-t class="payload-desc" keypath="admin.buyLicense" tag="span">
              <a :href="contactLink" target="_blank">{{ $t('admin.contactUs') }}</a>
            </i18n-t>
          </p>
        </div>
        <el-upload action="" class="file-upload" :show-file-list="false" :before-upload="handleUpload">
          <el-button size="small" type="primary" class="btn-upload">
            {{ hasLicense ? t('common.reUpload') : t('common.upload') }}
          </el-button>
        </el-upload>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { ref, computed } from 'vue'
import { ElProgress } from 'element-plus'
import type { License } from '@/types/admin'
import { queryLicense, uploadLicense } from '@/api/admin'
import useUploadFileAndRead from '@/composables/config/useUploadFileAndRead'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import useLang from '@/composables/useLang'

const { t, locale } = useI18n()
const isDataLoading = ref(false)
const licenseData: Ref<License | any> = ref(undefined)

const { currentLang } = useLang()

const hasLicense = computed(() => !!licenseData.value)

const labelWidth = computed(() => {
  return currentLang.value === 'zh' ? '120px' : '140px'
})

const pluginsStr = computed(() => {
  const { enabled_plugins } = licenseData.value || {}
  if (enabled_plugins && Array.isArray(enabled_plugins)) {
    return enabled_plugins.join(', ')
  }
  return ''
})

const licenseLink = computed(() => `https://www.emqx.com/${locale.value}/apply-licenses/neuron`)

const contactLink = computed(() => `https://www.emqx.com/${locale.value}/contact?product=neuron`)

const getLicense = async () => {
  try {
    isDataLoading.value = true
    const { data } = await queryLicense()
    const {  ...license } = data
    const { max_nodes, used_nodes, used_tags, max_node_tags } = license
    const nodesUsage = parseFloat((Number(used_nodes) / Number(max_nodes)).toFixed(2)) * 100
    const tagsUsage = parseFloat((Number(used_tags) / Number(max_node_tags)).toFixed(2)) * 100
    licenseData.value = {
      ...license,
      nodesUsage,
      tagsUsage,
    }
  } catch (error) {
    console.error(error)
  } finally {
    isDataLoading.value = false
  }
}

/**
const licenseStatus = computed(() => {
  if (!licenseData.value) {
    return ''
  }
  const { valid_since, valid_until } = licenseData.value
  const startTime = new Date(valid_since).getTime()
  const endTime = new Date(valid_until).getTime()
  const now = Date.now()
  if (startTime > now) {
    return t('admin.notYetValid')
  }
  if (now > endTime) {
    return t('admin.expired')
  }
  return t('admin.inEffect')
})
*/

// upload | reload license
const { readFile } = useUploadFileAndRead()
const handleUpload = async (file: any) => {
  const nameStrings = file.name.split('.')
  const type = nameStrings[nameStrings.length - 1]
  if (type !== 'lic') {
    ElMessage.warning(t('admin.uploadFileTypeError'))
    return false
  }
  try {
    const content: string = (await readFile(file)) as string
    await uploadLicense(content)
    ElMessage.success(t('admin.uploadSuccessful'))
    getLicense()
  } catch (error) {
    console.error(error)
  }
  return Promise.reject()
}

getLicense()
</script>

<style lang="scss" scoped>
.license {
  padding-bottom: 100px;
}
.placeholder {
  padding: 48px;
  text-align: center;
}
.msg.align-center {
  text-align: center;
}
.method-text {
  color: #bcbcbc;
  margin: 32px 0;
  > p {
    margin: 12px;
    margin-right: 0;
    margin-left: 0;
    a {
      margin: 0 2px;
      text-decoration: none;
      color: #459bf7;
    }
  }
}

.progress-bar {
  display: inline-flex;
  align-items: center;
  top: 2px;
}
:deep {
  .el-descriptions__label {
    display: inline-block;
    width: v-bind(labelWidth);
  }
  .el-progress-bar {
    width: 220px;
  }
  .el-progress__text {
    display: inline-block;
    margin-top: -2px;
  }
}
.progress-text {
  color: #1d1d1d;
  font-size: 14px;
}
</style>
