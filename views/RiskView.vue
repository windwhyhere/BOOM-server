<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">风控管理系统</h1>
        <p class="text-slate-500 text-sm mt-1">控制版本拦截、设备检测及数盟第三方风险感知</p>
      </div>
      <el-tag type="danger" effect="dark">安全模式: 严格</el-tag>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <el-card shadow="never" class="!rounded-2xl border-none bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-white/10 rounded-xl">
            <el-icon :size="24"><View /></el-icon>
          </div>
          <div>
            <h3 class="font-bold text-lg">Cloak 屏蔽系统</h3>
            <p class="text-slate-400 text-xs mt-0.5">基于版本号的流量拦截控制</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm">版本拦截总开关</span>
            <el-switch v-model="cloakEnabled" />
          </div>
          <div class="space-y-1.5">
            <span class="text-[10px] font-bold text-slate-500 uppercase">生效版本列表 (逗号分隔)</span>
            <el-input 
              v-model="cloakVersions" 
              placeholder="1.0.1, 1.0.2, 1.1.0" 
              class="risk-dark-input" 
              :disabled="!cloakEnabled"
            />
          </div>
        </div>
      </el-card>

      <el-card shadow="never" class="!rounded-2xl border-slate-200">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-brand-50 text-brand-600 rounded-xl">
            <el-icon :size="24"><Cpu /></el-icon>
          </div>
          <div>
            <h3 class="font-bold text-lg text-slate-800">ShuMeng 数盟风控</h3>
            <p class="text-slate-500 text-xs mt-0.5">第三方设备指纹与风险标签识别</p>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span class="text-sm font-medium text-slate-700">SDK 采集开关</span>
            <el-switch v-model="smSdk" size="small" />
          </div>
          <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span class="text-sm font-medium text-slate-700">服务端拦截逻辑</span>
            <el-switch v-model="smServer" size="small" />
          </div>
        </div>
      </el-card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <el-card shadow="never" class="!rounded-2xl border-slate-200">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-bold">设备环境检测策略</span>
              <el-button type="primary" link :icon="Setting">高级配置</el-button>
            </div>
          </template>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="item in checks" :key="item.key" class="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-brand-100 transition-colors">
              <div class="flex items-center gap-3">
                <el-icon class="text-slate-400"><CircleCheck /></el-icon>
                <span class="text-sm text-slate-700">{{ item.label }}</span>
              </div>
              <el-switch v-model="item.enabled" size="small" />
            </div>
          </div>
        </el-card>
      </div>

      <div class="space-y-6">
        <el-card shadow="never" class="!rounded-2xl border-slate-200">
          <template #header>
            <span class="font-bold">归因与屏蔽匹配</span>
          </template>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600">MMP 归因检测</span>
              <el-switch v-model="mmpEnabled" size="small" />
            </div>
            <div class="space-y-2">
              <span class="text-xs text-slate-400 font-bold uppercase">Referrer 关键词拦截</span>
              <el-input 
                v-model="referrerKeywords" 
                type="textarea" 
                :rows="4" 
                placeholder="utm_source=organic, utm_medium=(none)" 
              />
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { View, Cpu, Setting, CircleCheck } from '@element-plus/icons-vue';

const cloakEnabled = ref(true);
const cloakVersions = ref('1.0.5, 1.1.0');
const smSdk = ref(true);
const smServer = ref(true);
const mmpEnabled = ref(true);
const referrerKeywords = ref('utm_source=organic, utm_medium=(none)');

const checks = ref([
  { key: 'vpn', label: 'VPN 环境检测', enabled: true },
  { key: 'sim', label: 'SIM 卡状态检测', enabled: true },
  { key: 'root', label: 'Root/越狱识别', enabled: true },
  { key: 'emulator', label: '模拟器指纹检测', enabled: true },
  { key: 'ip', label: 'IP 代理池匹配', enabled: true },
  { key: 'dev', label: '开发者模式检测', enabled: false },
]);
</script>

<style scoped>
.risk-dark-input :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.05) !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}
.risk-dark-input :deep(.el-input__inner) {
  color: #fff !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>
