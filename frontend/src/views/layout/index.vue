<!-- 主頁面component-->

<script setup>
// 導入組件
import LayoutNav from '@/views/layout/components/LayoutNavigation.vue'
import LayoutHeader from '@/views/layout/components/LayoutHeader.vue'
import LayoutFooter from '@/views/layout/components/LayoutFooter.vue'
import {onMounted} from "vue";
import HomePage from '../home/index.vue';

//使用pinia
// import {useCategoryStore} from "@/stores/category.js"
// const store = useCategoryStore()

// onMounted(() => {
//   store.getCategories()
// })
</script>

<template>
  <!--  普通組件-->
  <LayoutNav />

  <LayoutHeader />
  <!--  二級路由出口組件-->
  <RouterView />
  <!--  RouterView會根據當前網址，對應到的路由設定，顯示子組件-->
  <LayoutFooter />

</template>

<style scoped lang="scss">


</style>
