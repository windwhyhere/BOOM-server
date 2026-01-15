<template>
  <!-- 如果未登录则显示登录界面 -->
  <LoginView v-if="!auth.isLoggedIn" @login="auth.login" />
  
  <el-container v-else class="h-screen overflow-hidden">
    <!-- 侧边导航栏 -->
    <el-aside width="240px" class="bg-white border-r border-slate-200 flex flex-col shadow-sm">
      <div class="p-6 flex items-center gap-3">
        <div class="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
          <el-icon :size="20"><Menu /></el-icon>
        </div>
        <span class="font-bold text-slate-800 text-lg tracking-tight">OpsCore</span>
      </div>

      <el-menu
        :default-active="route.path"
        class="border-none flex-1"
        router
      >
        <el-menu-item index="/ads">
          <el-icon><Monitor /></el-icon>
          <span>广告配置</span>
        </el-menu-item>
        <el-menu-item index="/strategy">
          <el-icon><ChatDotRound /></el-icon>
          <span>文案策略池</span>
        </el-menu-item>
        <el-menu-item index="/notifications">
          <el-icon><Bell /></el-icon>
          <span>消息通知</span>
        </el-menu-item>
        <el-menu-item index="/risk">
          <el-icon><Lock /></el-icon>
          <span>风控管理</span>
        </el-menu-item>
        <el-menu-item index="/economy">
          <el-icon><Money /></el-icon>
          <span>网赚数值</span>
        </el-menu-item>
      </el-menu>

      <div class="p-4 border-t border-slate-100">
        <div class="bg-slate-50 rounded-xl p-3 flex items-center gap-3 group cursor-pointer hover:bg-slate-100 transition-colors" @click="auth.logout">
          <el-avatar :size="32" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold text-slate-700 truncate">管理员</p>
            <p class="text-[10px] text-slate-400 truncate">admin@opscore.com</p>
          </div>
          <el-icon class="text-slate-400 group-hover:text-red-500 transition-colors"><SwitchButton /></el-icon>
        </div>
      </div>
    </el-aside>

    <el-container class="flex flex-col">
      <!-- 顶栏 -->
      <el-header class="bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 h-16 shrink-0 z-10">
        <div class="flex items-center gap-4">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>控制台</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentRouteName }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="flex items-center gap-4">
          <el-select v-model="selectedAppId" placeholder="选择应用" class="w-48">
            <el-option v-for="app in apps" :key="app.id" :label="app.name" :value="app.id" />
          </el-select>
          <el-button circle><el-icon><Bell /></el-icon></el-button>
        </div>
      </el-header>

      <!-- 内容区：独立滚动 -->
      <el-main class="p-8 bg-slate-50 overflow-y-auto">
        <div class="max-w-7xl mx-auto">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import LoginView from './views/LoginView.vue';

// 定义简单的 Auth Store 处理登录状态
const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);
  const login = () => isLoggedIn.value = true;
  const logout = () => isLoggedIn.value = false;
  return { isLoggedIn, login, logout };
});

const auth = useAuthStore();
const route = useRoute();
const selectedAppId = ref('app_1');

const apps = [
  { id: 'app_1', name: 'Puzzle Master 3D' },
  { id: 'app_2', name: 'Daily Utility Tool' },
  { id: 'app_3', name: 'Speed Racer Pro' }
];

const currentRouteName = computed(() => {
  const map: Record<string, string> = {
    '/ads': '广告配置',
    '/strategy': '文案策略池',
    '/notifications': '消息通知中心',
    '/risk': '风控管理系统',
    '/economy': '网赚数值配置'
  };
  return map[route.path] || '概览';
});
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
