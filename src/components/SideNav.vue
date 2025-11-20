<template>
  <el-menu class="el-menu-vertical-demo side-nav" router :default-active="actvieMenu">
    <template v-for="(nav, index) in navList">
      <el-menu-item class="nav-item" v-if="!nav.subMenus" style="padding-left: 0" :key="index" :index="nav.to">
        <div class="nav-item-content">
          <i class="nav-icon iconfont" :class="nav.icon"></i>
          <span class="nav-label ellipsis">{{ $t(`${nav.label}`) }}</span>
        </div>
      </el-menu-item>
      <el-sub-menu v-else :key="nav.to" :index="nav.to">
        <template #title>
          <div class="nav-item-content">
            <i class="nav-icon iconfont" :class="nav.icon"></i>
            <span class="nav-label ellipsis">{{ $t(`${nav.label}`) }}</span>
          </div>
        </template>
        <div class="sub-menu-list">
          <el-menu-item
            class="nav-item"
            v-for="(subMenuItem, index) in nav.subMenus"
            :key="index"
            :index="subMenuItem.to"
          >
            <div class="nav-item-content">
              <span class="nav-label ellipsis">{{ $t(`${subMenuItem.label}`) }}</span>
            </div>
          </el-menu-item>
        </div>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script lang="ts">
import { computed, defineComponent,ref,onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'SideNav',
})
</script>

<script lang="ts" setup>

const route = useRoute()
const firstLevelRoutePathArr = ref<string[]>([])
const secondLevelRoutePathArr = ref<string[]>([])

const navList = [
  {
    to: '/monitoring/data',
    label: 'data.monitoring',
    icon: 'iconstatus',
    subMenus: [
      {
        to: '/monitoring/data',
        label: 'data.dataMonitoring',
      },
    ],
  },
  {
    to: '/configuration',
    label: 'config.config',
    icon: 'iconconfig',
    subMenus: [
      {
        to: '/configuration/south-driver',
        label: 'config.southDeviceManagement',
      },
      {
        to: '/configuration/north-driver',
        label: 'config.northAppSetup',
      },
      {
        to: '/configuration/plugin',
        label: 'config.plugin',
      },
    ],
  },
  {
    to: '/admin',
    label: 'admin.admin',
    icon: 'iconAdministration1',
    subMenus: [
      {
        to: '/admin/change-password',
        label: 'common.changePassword',
      },
    ],
  },
]

// 计算活跃菜单
const actvieMenu = computed(() => {
  const currentPath = route.path
  
  // 先匹配二级路由
  const secondLevelMatch = secondLevelRoutePathArr.value.find(item => 
    currentPath.startsWith(item)
  )
  if (secondLevelMatch) {
    return secondLevelMatch
  }

  // 再匹配一级路由
  const firstLevelMatch = firstLevelRoutePathArr.value.find(item => 
    currentPath.startsWith(item)
  )
  
  return firstLevelMatch || ''
})

// 初始化路由路径数组
const initRoutePaths = () => {
  navList.forEach((menu) => {
    if (menu.subMenus) {
      menu.subMenus.forEach((item) => {
        if (item.to.split('/').length > 2) {
          // 二级或更深层级路由
          secondLevelRoutePathArr.value.push(item.to)
        } else {
          // 一级路由
          firstLevelRoutePathArr.value.push(item.to)
        }
      })
    } else {
      firstLevelRoutePathArr.value.push(menu.to)
    }
  })
}

onMounted(() => {
  initRoutePaths()
})
</script>
