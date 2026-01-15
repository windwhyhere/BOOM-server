<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">网赚数值配置</h1>
        <p class="text-slate-500 text-sm mt-1">配置提现门槛、任务权重及详细数值逻辑</p>
      </div>
      <div class="flex gap-2">
        <el-button :icon="Refresh">同步配置</el-button>
        <el-button type="primary" :icon="Plus" @click="addTask">新增提现任务</el-button>
      </div>
    </div>

    <!-- 核心统计概览 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <el-card shadow="never" class="!rounded-2xl border-slate-200">
        <template #header>
          <div class="flex items-center gap-2 text-slate-500">
            <el-icon><TrendCharts /></el-icon>
            <span class="text-xs font-bold uppercase tracking-wider">基础汇率</span>
          </div>
        </template>
        <div class="flex items-end gap-2">
          <span class="text-3xl font-black text-slate-800">10,000</span>
          <span class="text-slate-400 text-sm pb-1">金币 = 1.00 USD</span>
        </div>
      </el-card>

      <el-card shadow="never" class="!rounded-2xl border-slate-200">
        <template #header>
          <div class="flex items-center gap-2 text-slate-500">
            <el-icon><Ticket /></el-icon>
            <span class="text-xs font-bold uppercase tracking-wider">今日提现总额</span>
          </div>
        </template>
        <div class="text-3xl font-black text-brand-600">$1,248.50</div>
      </el-card>

      <el-card shadow="never" class="!rounded-2xl border-slate-200">
        <template #header>
          <div class="flex items-center gap-2 text-slate-500">
            <el-icon><User /></el-icon>
            <span class="text-xs font-bold uppercase tracking-wider">平均提现耗时</span>
          </div>
        </template>
        <div class="text-3xl font-black text-slate-800">3.4 <span class="text-sm font-normal text-slate-400">天</span></div>
      </el-card>
    </div>

    <!-- 任务列表表格优化 -->
    <el-card shadow="never" class="!rounded-2xl border-slate-200" body-class="!p-0">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-bold text-slate-700">提现后续任务序列</span>
          <el-tag type="warning" effect="light">权重由高到低排列</el-tag>
        </div>
      </template>

      <el-table :data="tasks" style="width: 100%" class="modern-table">
        <el-table-column width="60" align="center">
          <template #default>
            <el-icon class="text-slate-300 cursor-move"><Operation /></el-icon>
          </template>
        </el-table-column>

        <el-table-column label="任务名称与描述">
          <template #default="{ row }">
            <div class="py-2">
              <el-input 
                v-model="row.name" 
                type="textarea" 
                :autosize="{ minRows: 2, maxRows: 5 }"
                placeholder="在此输入详细的任务标题和运营文案说明..."
                class="name-textarea"
              />
              <div class="mt-2 flex gap-2">
                <el-tag size="small" v-if="row.name.length > 20" type="info">长文案</el-tag>
                <span class="text-[10px] text-slate-300 uppercase">ID: {{ row.id }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="达成条件 (JSON)" width="280">
          <template #default="{ row }">
            <el-input v-model="row.condition" placeholder="e.g. { ads: 15, level: 5 }" size="small" class="font-mono" />
          </template>
        </el-table-column>

        <el-table-column label="奖励金额 ($)" width="150" align="center">
          <template #default="{ row }">
            <el-input-number v-model="row.reward" :precision="2" :step="0.1" size="small" class="!w-full" />
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.status" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="80" align="center">
          <template #default="{ $index }">
            <el-button type="danger" link :icon="Delete" @click="tasks.splice($index, 1)" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div class="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4">
      <el-icon class="text-blue-500 mt-1" :size="20"><InfoFilled /></el-icon>
      <div class="space-y-1">
        <h4 class="font-bold text-blue-900">配置生效提示</h4>
        <p class="text-sm text-blue-700 leading-relaxed">
          任务名称支持多行输入且会自动撑开，您可以直接粘贴带有排版要求的详细运营文案。修改后点击右上角的同步配置按钮即可实时下发到客户端。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Delete, Refresh, Operation, TrendCharts, Ticket, User, InfoFilled } from '@element-plus/icons-vue';
import type { WithdrawalTask } from '../types';

const tasks = ref<WithdrawalTask[]>([
  { id: '1001', name: '观看 15 个激励视频广告（需完整观看并点击）', reward: 0.50, condition: '{"ads": 15}', status: true },
  { id: '1002', name: '连续签到 3 天（补签卡补签不计入此任务进度）', reward: 1.20, condition: '{"checkin": 3}', status: true },
  { id: '1003', name: '限时冲刺：邀请 3 名有效新用户进入游戏', reward: 5.00, condition: '{"invite": 3}', status: false },
]);

const addTask = () => {
  tasks.value.push({
    id: Math.floor(Math.random() * 9000 + 1000).toString(),
    name: '',
    reward: 0,
    condition: '',
    status: true
  });
};
</script>

<style scoped>
.modern-table :deep(.el-table__row) {
  transition: background 0.3s;
}
.modern-table :deep(.el-table__row:hover) {
  background-color: #f1f5f9 !important;
}
.name-textarea :deep(.el-textarea__inner) {
  box-shadow: none;
  background-color: transparent;
  padding: 8px 0;
  border: 1px solid transparent;
  transition: all 0.2s;
}
.name-textarea :deep(.el-textarea__inner:focus) {
  border-color: #6366f1;
  padding-left: 8px;
  background-color: #fff;
}
</style>