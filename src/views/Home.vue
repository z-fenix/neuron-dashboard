<template>
  <div class="main">
    <el-container>
      <el-header>
        <Header class="header" ></Header>
      </el-header>
      <el-container class="body" >
        <el-aside ref="navContainer" class="nav-container" style="width: 220px">
          <side-nav class="sidebar"></side-nav>
        </el-aside>
        <el-main>
          <div >
            <Breadcrumb />
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, onBeforeUnmount } from 'vue'
import Header from '@/components/Header.vue'
import SideNav from '@/components/SideNav.vue'
import { useStore } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Header,
    SideNav,
    Breadcrumb,
  },
  setup() {
    const navContainer = ref<HTMLElement>()
    const store = useStore()
    const isSubAppLoading = computed(() => store.state.isSubAppLoading)

    let resizeTimer: undefined | number = undefined

    const setNavPosition = (position: 'fixed' | 'static') => {
      if (navContainer.value&&navContainer.value.style) {
        navContainer.value.style.position = position
      }
    }

    const handleResize = () => {
      // 清除之前的定时器
      if (resizeTimer) {
        clearTimeout(resizeTimer)
      }
      
      // 防抖处理
      resizeTimer = window.setTimeout(() => {
        
        // 根据最小宽度1250px的要求设置位置
        if (window.innerWidth >= 1000) {
          setNavPosition('fixed')
        } else {
          setNavPosition('static')
        }
      }, 200)
    }

    onMounted(() => {
      //initializeNavPosition()
      window.addEventListener('resize', handleResize)
    })

    onBeforeUnmount(() => {
      if (resizeTimer) {
        clearTimeout(resizeTimer)
      }
      window.removeEventListener('resize', handleResize)
    })

    return {
      isSubAppLoading,
      navContainer
    }
  },
})
</script>

<style scoped>
.main {
  overflow-x: auto; 
}
.body{
  height: calc(100vh - 80px);
}
.nav-container {
  width: 220px;
  z-index: 100;
}

</style>