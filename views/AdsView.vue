<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">广告策略配置</h1>
        <p class="text-slate-500 text-sm mt-1">定义流量分发规则与广告聚合策略</p>
      </div>
      <el-button type="primary" :icon="Plus" @click="addRule">新建流量规则</el-button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-4">
        <el-card v-for="rule in rules" :key="rule.id" shadow="never" class="!rounded-2xl border-slate-200">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                P{{ rule.priority }}
              </div>
              <div>
                <h3 class="font-bold text-slate-800">{{ rule.name }}</h3>
                <div class="flex gap-2 mt-1">
                  <el-tag v-for="c in rule.conditions.channels" :key="c" size="small" type="info">{{ c }}</el-tag>
                  <el-tag size="small" type="success">{{ rule.conditions.userLevel }}</el-tag>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <el-switch v-model="rule.enabled" />
              <el-button :icon="Edit" circle size="small" />
              <el-button :icon="Delete" circle size="small" type="danger" plain @click="removeRule(rule.id)" />
            </div>
          </div>

          <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">策略分配占比</div>
            <div class="flex h-2 rounded-full overflow-hidden mb-4">
              <div 
                v-for="(alloc, idx) in rule.allocations" 
                :key="alloc.strategyId"
                :style="{ width: alloc.percentage + '%', backgroundColor: COLORS[idx % COLORS.length] }"
              ></div>
            </div>
            <div class="grid grid-cols-2 gap-y-2">
              <div v-for="(alloc, idx) in rule.allocations" :key="alloc.strategyId" class="flex items-center justify-between text-xs pr-4">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: COLORS[idx % COLORS.length] }"></span>
                  <span class="text-slate-600">{{ getStrategyName(alloc.strategyId) }}</span>
                </div>
                <span class="font-mono font-bold">{{ alloc.percentage }}%</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <div class="space-y-6">
        <el-card shadow="never" class="!rounded-2xl border-slate-200">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-bold">策略库</span>
              <el-button type="primary" link :icon="Plus" @click="addStrategy">添加</el-button>
            </div>
          </template>
          <div class="space-y-3">
            <div v-for="strat in strategies" :key="strat.id" class="p-3 border border-slate-100 rounded-xl hover:border-brand-200 transition-colors bg-slate-50/50">
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-sm text-slate-700">{{ strat.name }}</span>
                <el-icon class="text-slate-400 cursor-pointer"><Setting /></el-icon>
              </div>
              <div class="flex gap-2">
                <el-tag size="small" type="info" effect="plain">{{ strat.provider }}</el-tag>
                <el-tag size="small" effect="plain">{{ strat.aggregationType }}</el-tag>
              </div>
            </div>
          </div>
        </el-card>

        <div class="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-xs text-amber-800 leading-relaxed flex gap-3">
          <el-icon :size="16" class="mt-0.5"><WarningFilled /></el-icon>
          <p>策略库仅定义“怎么展示广告”。具体的“给谁展示”请在左侧分发规则中通过优先级 P0-P99 进行配置。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Delete, Edit, Monitor, Setting, WarningFilled } from '@element-plus/icons-vue';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const strategies = ref([
  { id: 'str_1', name: 'TopOn 主流策略', aggregationType: 'WATERFALL', provider: 'TopOn' },
  { id: 'str_2', name: 'Max 激进 Bidding', aggregationType: 'BIDDING', provider: 'Max' },
  { id: 'str_3', name: 'Admob 兜底', aggregationType: 'SINGLE', provider: 'Admob' },
]);

const rules = ref([
  {
    id: 'rule_1',
    name: 'T1 国家高价策略',
    priority: 1,
    enabled: true,
    conditions: { channels: ['MTG', 'Facebook'], countries: ['US', 'CA'], userLevel: '新用户' },
    allocations: [{ strategyId: 'str_1', percentage: 60 }, { strategyId: 'str_2', percentage: 40 }]
  },
  {
    id: 'rule_2',
    name: '全局分流策略',
    priority: 99,
    enabled: true,
    conditions: { channels: ['所有'], countries: ['全球'], userLevel: '所有' },
    allocations: [{ strategyId: 'str_3', percentage: 100 }]
  }
]);

const getStrategyName = (id: string) => strategies.value.find(s => s.id === id)?.name || '未知策略';

const removeRule = (id: string) => {
  rules.value = rules.value.filter(r => r.id !== id);
};

const addRule = () => {
  // Logic to open modal
};

const addStrategy = () => {
  // Logic to open modal
};
</script>
