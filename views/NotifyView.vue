<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">消息通知中心</h1>
        <p class="text-slate-500 text-sm mt-1">管理 FCM 远程推送与 Local 本地召回通知</p>
      </div>
      <el-switch v-model="globalEnabled" active-text="系统总开关" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <el-tabs v-model="activeTab" type="border-card" class="!rounded-2xl overflow-hidden !border-slate-200">
          <el-tab-pane label="FCM 远程策略" name="fcm">
            <div class="space-y-6 p-2">
              <el-form label-position="top">
                <el-form-item label="Firebase 配置 (JSON)">
                  <el-input type="textarea" :rows="2" v-model="fcmJson" placeholder="{...}" class="font-mono" />
                </el-form-item>
              </el-form>

              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-bold text-slate-700">Topic 策略管理</span>
                <el-button type="primary" link :icon="Plus">添加 Topic</el-button>
              </div>

              <div v-for="topic in topics" :key="topic.id" class="border border-slate-100 rounded-2xl p-4 bg-slate-50/30 mb-4">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <el-icon class="text-brand-600"><PriceTag /></el-icon>
                    <span class="font-bold">{{ topic.name }}</span>
                  </div>
                  <div class="flex gap-2">
                    <el-button size="small" circle :icon="Plus" @click="addStrategy(topic)" />
                    <el-button size="small" circle :icon="Delete" type="danger" plain />
                  </div>
                </div>

                <div class="space-y-3">
                  <div v-for="strat in topic.strategies" :key="strat.id" class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
                    <div class="flex-1 space-y-3">
                      <el-input v-model="strat.title" placeholder="通知标题" size="small" />
                      <el-input v-model="strat.body" type="textarea" :rows="2" placeholder="通知详情..." size="small" />
                    </div>
                    <div class="w-20 h-20 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      <img v-if="strat.imageUrl" :src="strat.imageUrl" class="w-full h-full object-cover" />
                      <el-icon v-else class="text-slate-300" :size="24"><Picture /></el-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="Local 本地通知" name="local">
            <div class="p-8 text-center text-slate-400">
              <el-icon :size="48" class="mb-4 opacity-20"><Clock /></el-icon>
              <p>本地通知配置模块加载中...</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="space-y-6">
        <el-card shadow="never" class="!rounded-[2rem] border-slate-800 bg-slate-900 !p-2">
          <div class="bg-white rounded-[1.5rem] overflow-hidden min-h-[500px] relative flex flex-col">
            <div class="h-6 bg-slate-100 flex justify-between px-4 items-center text-[10px] text-slate-400 font-bold">
              <span>9:41</span>
              <div class="flex gap-1">
                <el-icon><Connection /></el-icon>
                <el-icon><BatteryFull /></el-icon>
              </div>
            </div>

            <div class="p-4 flex-1">
              <div class="h-4 w-2/3 bg-slate-100 rounded mb-4"></div>
              <div class="h-32 bg-slate-50 rounded-2xl mb-4 border border-slate-100 border-dashed"></div>
              
              <div class="absolute top-4 left-3 right-3 bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-3 border border-slate-200/50 transform transition-all hover:scale-[1.02]">
                <div class="flex gap-3">
                  <div class="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shrink-0">
                    <el-icon :size="20"><Bell /></el-icon>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex justify-between items-center mb-0.5">
                      <span class="text-[10px] font-bold text-slate-900 uppercase">APP NAME</span>
                      <span class="text-[10px] text-slate-400">现在</span>
                    </div>
                    <p class="text-xs font-bold text-slate-800 line-clamp-1">每日奖励已就绪！</p>
                    <p class="text-[10px] text-slate-600 line-clamp-2 mt-0.5">您的金币宝箱已经快被撑破了，快回来领取吧！</p>
                  </div>
                </div>
                <div class="mt-2 h-24 bg-slate-100 rounded-lg overflow-hidden">
                  <img src="https://picsum.photos/400/200" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </el-card>
        
        <el-button type="primary" class="w-full !rounded-xl" size="large">测试发送预览</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Delete, PriceTag, Picture, Bell, Clock, Connection, BatteryFull } from '@element-plus/icons-vue';

const globalEnabled = ref(true);
const activeTab = ref('fcm');
const fcmJson = ref('{\n  "project_id": "opscore-3921"\n}');

const topics = ref([
  {
    id: 't1',
    name: 'daily_reward_topic',
    strategies: [
      { id: 's1', title: '奖励提醒', body: '快来领取您的今日奖励！', imageUrl: 'https://picsum.photos/400/200' }
    ]
  }
]);

const addStrategy = (topic: any) => {
  topic.strategies.push({ id: Date.now().toString(), title: '', body: '', imageUrl: '' });
};
</script>
