<template>
  <el-header class="header">
    <div class="header-container">
      <img src="../assets/images/logo.png" alt="neuron-logo" width="141" />
      <div>
        <el-dropdown class="dropdown-item">
          <span class="el-dropdown-link">
            {{ $t('common.systemInformation') }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu class="header-menu">
              <!-- <el-dropdown-item @click="goLicense">
                <i class="iconfont iconLicense"></i>
                <span>License</span>
              </el-dropdown-item> -->
              <el-dropdown-item @click="goAbout">
                <i class="iconfont iconabout"></i>
                <span> {{ $t('common.about') }}</span>
              </el-dropdown-item>
              <el-dropdown-item @click="downloadLogsFile">
                <i class="iconfont icondownload"></i>
                <span> {{ $t('admin.debugFiles') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-dropdown v-if="!EN_LANG" class="dropdown-item" @command="handleChangeLanguage">
          <span class="el-dropdown-link">
            {{ langLabel }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu class="header-menu">
              <el-dropdown-item
                v-for="item in langList"
                :key="item.label"
                :command="item.value"
                :class="{ 'active-lang': item.value === lang }"
              >
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-dropdown>
          <span class="el-dropdown-link">
            <span class="user-bg">
              <i class="iconfont iconAdministration1"></i>
            </span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu class="header-menu">
              <el-dropdown-item @click="logout">{{ $t('common.logout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { downloadLogs } from '@/api/admin'
import { useDownload } from '@/composables/useDownload'
import { useLang } from '@/composables/useLang'
import { EN_LANG } from '@/config/index'

const store = useStore()
const router = useRouter()

const goLicense = () => {
  router.push({ name: 'License' })
}

const goAbout = () => {
  router.push({ name: 'About' })
}

const { downloadFile } = useDownload()
const downloadLogsFile = () => {
  downloadLogs().then((res) => {
    const { data, headers } = res
    downloadFile(headers, data)
  })
}

const { langList } = useLang()
const { changeLanguage } = useLang()
const changeCurrentLang = (lang: string) => {
  changeLanguage(lang as 'zh' | 'en')
}
const lang = computed({
  get() {
    return store.state.lang
  },
  set(val: string) {
    changeCurrentLang(val)
  },
})

const logout = async () => {
  try {
    changeCurrentLang(lang.value)
    store.commit('LOGOUT')
    router.push({ name: 'Login' })
  } catch (error) {
    console.error(error)
  }
}

const langLabel = computed(() => langList.find((item) => item.value === lang.value)?.label || '')

const handleChangeLanguage = (command: string) => {
  lang.value = command
}
</script>

<style lang="scss">
@import '@/styles/ui-variables.scss';

.header {
  .el-dropdown {
    color: #fff;
    vertical-align: middle;
  }

  .header-container{
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items:  center;
  }
}
.dropdown-item {
  margin-left: 14px;
}
.header-menu {

  .el-dropdown-item {
    padding-left: 24px;
    padding-right: 24px;
  }
  .el-dropdown-item {
    display: flex;
    align-items: center;
  }
}
.active-lang {
  color: $--color-primary !important;
}
.username {
  margin-bottom: 12px;
}
.account-setting {
  .el-button {
    height: 20px;
    min-height: 20px;
    padding: 0;
    line-height: 20px;
    color: #0d446e;
    &:not(:last-child) {
      position: relative;
      padding-right: 6px;
      margin-right: 6px;
      &::after {
        content: '';
        height: 100%;
        width: 1px;
        background-color: #d4dbe0;
      }
    }
  }
}
.iconfont.iconAdministration1 {
  font-size: 20px;
  position: relative;
  left: 1px;
}
.user-bg {
  display: inline-block;
  margin-left: 24px;
  margin-right: 10px;
  width: 28px;
  height: 28px;
  line-height: 28px;
  background: #104d7c;
  border-radius: 50%;
  text-align: center;
}
</style>
