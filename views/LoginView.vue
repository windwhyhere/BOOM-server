<template>
  <div class="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4 font-sans">
    <div class="w-full max-w-[640px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative flex flex-col min-h-[560px] transition-all duration-300">
      
      <!-- 登录方式切换 -->
      <div 
        class="absolute top-0 right-0 z-20 cursor-pointer group" 
        @click="isQrMode = !isQrMode"
      >
          <div class="w-0 h-0 border-t-[60px] border-r-[60px] border-t-transparent border-r-indigo-50/80 absolute top-0 right-0"></div>
          <div class="absolute top-3 right-3 p-1 rounded-bl-2xl rounded-tr-lg hover:scale-105 transition-transform">
             <el-icon v-if="isQrMode" :size="24" class="text-indigo-600"><Monitor /></el-icon>
             <el-icon v-else :size="24" class="text-indigo-600"><Grid /></el-icon>
          </div>
          <div class="absolute right-[60px] top-6 -translate-y-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
              {{ isQrMode ? '账号密码登录' : '扫码登录' }}
              <div class="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-slate-800"></div>
          </div>
      </div>

      <!-- 扫码登录视图 -->
      <div v-if="isQrMode" class="flex-1 flex flex-col items-center justify-center p-12 animate-fade-in text-center">
           <h2 class="text-2xl font-bold text-slate-800 mb-2">飞书扫码登录</h2>
           <p class="text-slate-500 text-sm mb-10">安全 · 便捷 · 高效</p>

           <div 
              class="w-56 h-56 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center mb-8 shadow-inner relative group cursor-pointer overflow-hidden transition-all hover:border-indigo-200"
              @click="$emit('login')"
           >
               <svg viewBox="0 0 100 100" class="w-48 h-48 text-slate-800" fill="currentColor">
                  <path d="M10 10h20v20h-20zM40 10h20v10h-20zM70 10h20v20h-20zM20 40h10v10h-10zM50 40h20v10h-20zM80 40h10v20h-10zM10 70h20v20h-20zM40 70h10v10h-10zM70 70h20v20h-20zM15 15v10h10v-10zM75 15v10h10v-10zM15 75v10h10v-10zM35 10h5v5h-5zM65 30h5v5h-5zM40 50h10v10h-10zM60 80h10v10h-10z" />
                  <rect x="35" y="35" width="30" height="30" fill-opacity="0.05" />
                  <path d="M12 12h16v16h-16z" fill-opacity="0.1"/>
                  <path d="M72 12h16v16h-16z" fill-opacity="0.1"/>
                  <path d="M12 72h16v16h-16z" fill-opacity="0.1"/>
               </svg>
              <div class="absolute inset-0 bg-white/95 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100">
                   <el-icon :size="32" class="text-indigo-600 mb-3"><View /></el-icon>
                   <span class="text-sm font-bold text-slate-800">模拟扫码成功</span>
                   <span class="text-xs text-slate-400 mt-1">点击即可自动跳转</span>
              </div>
           </div>

           <div class="space-y-1">
              <p class="text-sm text-slate-600 font-medium">请使用 飞书客户端 扫一扫</p>
              <p class="text-xs text-slate-400">OpsCore 中台通用登录</p>
           </div>
      </div>

      <!-- 账号授权视图 -->
      <div v-else class="flex-1 flex flex-col">
          <div class="p-12 pb-8 flex flex-col items-center flex-1 animate-fade-in">
              <div class="flex items-center gap-8 mb-8">
                  <div class="w-16 h-16 bg-[#1677ff] rounded-2xl flex items-center justify-center shadow-md">
                     <el-icon :size="32" class="text-white"><Bell /></el-icon>
                  </div>
                  <el-icon :size="24" class="text-slate-300"><Switch /></el-icon>
                  <div class="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-md relative overflow-hidden">
                     <div class="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-10"></div>
                     <el-icon :size="40" class="text-cyan-500"><Platform /></el-icon>
                  </div>
              </div>

              <h2 class="text-xl font-bold text-slate-800 mb-8 text-center">
                  OpsCore 中台 请求登录你的 飞书 账号
              </h2>

              <div class="w-full bg-slate-50 rounded-lg p-4 flex items-center justify-between mb-8 group border border-transparent hover:border-slate-200 transition-colors">
                  <div class="flex items-center gap-4">
                     <el-avatar :size="40" src="https://api.dicebear.com/7.x/identicon/svg?seed=Company" />
                     <div>
                        <div class="font-bold text-slate-800 text-sm">成都中云天下科技有限公司</div>
                        <div class="text-slate-500 text-xs mt-0.5">Admin User</div>
                     </div>
                  </div>
                  <el-button type="primary" link @click="$emit('login')">使用其他账号</el-button>
              </div>

              <div class="w-full space-y-4 mb-8">
                   <p class="text-slate-500 text-sm">授权后，应用将获得以下权限：</p>
                   <ul class="space-y-3">
                     <li class="flex items-start gap-2 text-sm text-slate-700">
                        <div class="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                        <span>获取你的个人信息（姓名、头像）</span>
                     </li>
                   </ul>
              </div>
          </div>

          <div class="p-6 md:px-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-white mt-auto w-full">
             <div class="flex items-center gap-2 text-slate-500 text-sm cursor-pointer hover:text-slate-700">
                <el-icon><Globe /></el-icon>
                <span>简体中文</span>
             </div>

             <div class="flex items-center gap-4 w-full md:w-auto">
                <el-button size="large" class="w-full md:w-32 rounded-lg">拒绝</el-button>
                <el-button type="primary" size="large" class="w-full md:w-32 rounded-lg" @click="$emit('login')">授权</el-button>
             </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineEmits(['login']);
const isQrMode = ref(false);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
