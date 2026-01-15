<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">文案策略池</h1>
        <p class="text-slate-500 text-sm mt-1">管理各渠道的推送文案及 Body 内容详情</p>
      </div>
      <el-button type="primary" :icon="Plus" @click="addChannel">新增渠道</el-button>
    </div>

    <div v-for="channel in channels" :key="channel.id" class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            <el-icon class="text-brand-600"><ChatDotRound /></el-icon>
          </div>
          <span class="font-bold text-slate-700">{{ channel.name }}</span>
          <el-tag size="small" type="info">{{ channel.strategies.length }} 条文案</el-tag>
        </div>
        <el-button type="primary" link :icon="Plus" @click="addStrategy(channel)">添加文案策略</el-button>
      </div>

      <div class="p-6">
        <el-empty v-if="channel.strategies.length === 0" description="暂无策略" :image-size="60" />
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="(item, idx) in channel.strategies" 
            :key="item.id" 
            class="group relative border border-slate-100 rounded-xl p-4 hover:border-brand-200 hover:bg-brand-50/10 transition-all"
          >
            <div class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <el-button type="danger" link :icon="Delete" @click="removeStrategy(channel, idx)" />
            </div>

            <div class="space-y-4">
              <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">文案标题</label>
                <el-input v-model="item.title" placeholder="输入推送标题..." />
              </div>
              
              <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Body 详情内容</label>
                <el-input 
                  v-model="item.body" 
                  type="textarea" 
                  :rows="3" 
                  placeholder="输入通知Body内容..." 
                  resize="none"
                />
              </div>

              <div class="flex items-center gap-3">
                <div class="flex-1">
                  <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">附件图片 URL</label>
                  <el-input v-model="item.imageUrl" placeholder="https://..." size="small" />
                </div>
                <div class="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                  <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover" />
                  <el-icon v-else class="text-slate-300"><Picture /></el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Delete, ChatDotRound, Picture } from '@element-plus/icons-vue';
import type { StrategyChannel } from '../types';

const channels = ref<StrategyChannel[]>([
  {
    id: 'ch_1',
    name: '次日召回通知',
    strategies: [
      { id: 's1', title: '宝箱已满！', body: '您的金币宝箱已经快被撑破了，快回来领取吧！今天登录还有额外惊喜。', imageUrl: 'https://picsum.photos/200' }
    ]
  },
  {
    id: 'ch_2',
    name: '限时冲刺活动',
    strategies: []
  }
]);

const addChannel = () => {
  channels.value.unshift({
    id: Date.now().toString(),
    name: '新策略渠道',
    strategies: []
  });
};

const addStrategy = (channel: StrategyChannel) => {
  channel.strategies.push({
    id: Date.now().toString(),
    title: '',
    body: '',
    imageUrl: ''
  });
};

const removeStrategy = (channel: StrategyChannel, idx: number) => {
  channel.strategies.splice(idx, 1);
};
</script>