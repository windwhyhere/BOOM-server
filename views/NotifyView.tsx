
import React, { useState, useEffect } from 'react';
import { NotificationConfig, NotifType, AppProfile, FCMTopic, FCMStrategy, LocalChannel, LocalStrategy, MediaChannel, MediaStrategy } from '../types';
import { Card, Input, Switch, TextArea, Select, Button, Badge } from '../components/UI';
import { Bell, Key, Plus, Trash2, Layers, Tag, Copy, Image as ImageIcon, Clock, MessageSquare, Repeat, PlayCircle, Radio } from 'lucide-react';
import { theme } from 'antd';

interface NotifyViewProps {
  selectedApp: AppProfile;
}

export const NotifyView: React.FC<NotifyViewProps> = ({ selectedApp }) => {
  const { token } = theme.useToken();
  const [activeTab, setActiveTab] = useState<'remote' | 'local' | 'media'>('remote');
  
  // Initialize Mock Data
  const [config, setConfig] = useState<NotificationConfig>(() => {
    // Helper generators
    const generateTopics = (prefix: string): FCMTopic[] => [
      {
        id: 'topic_1',
        name: 'daily_rewards',
        type: NotifType.DATA,
        priority: 'high',
        intervalMins: 120,
        strategies: [
           { id: 's1', title: '每日签到', body: `${prefix} 登录领取今日金币！`, imageUrl: 'https://picsum.photos/400/200?random=1' },
           { id: 's2', title: '奖励提醒', body: '您的奖励即将过期，点击查看。', imageUrl: '' }
        ]
      },
      {
        id: 'topic_2',
        name: 'promo_event',
        type: NotifType.NOTICE,
        priority: 'normal',
        intervalMins: 240,
        strategies: [
           { id: 's3', title: '限时活动', body: '周末狂欢开启，双倍经验！', imageUrl: 'https://picsum.photos/400/200?random=2' },
        ]
      }
    ];

    const generateChannels = (prefix: string): LocalChannel[] => [
        {
            id: 'lc_1',
            name: '次日召回',
            firstSendDelayMins: 1440,
            intervalMins: 2880,
            strategies: [
                { id: 'ls_1', title: '宝箱已满', body: `${prefix} 这里的宝箱满了，快来领取！`, imageUrl: '' },
                { id: 'ls_2', title: '想你了', body: '别忘了回来看看哦', imageUrl: '' }
            ]
        },
        {
            id: 'lc_2',
            name: '体力恢复',
            firstSendDelayMins: 120,
            intervalMins: 360,
            strategies: [
                { id: 'ls_3', title: '体力充满', body: '体力已恢复，继续冒险吧。', imageUrl: '' }
            ]
        }
    ];

    const generateMediaChannels = (prefix: string): MediaChannel[] => [
        {
            id: 'mc_1',
            name: '音乐播放器',
            firstSendDelayMins: 60,
            intervalMins: 120,
            strategies: [
                { id: 'ms_1', title: '正在播放', body: `${prefix} 推荐歌曲: City of Stars`, imageUrl: '' }
            ]
        }
    ];

    if (selectedApp.id === 'app_3') {
       return {
          globalEnabled: false,
          fcm: {
            enabled: true,
            jsonConfig: '{}',
            topics: generateTopics('工具箱')
          },
          local: {
            enabled: true,
            channels: generateChannels('工具箱')
          },
          media: {
            enabled: false,
            channels: generateMediaChannels('工具箱')
          }
       }
    }
    return {
      globalEnabled: true,
      fcm: {
        enabled: true,
        jsonConfig: '{\n  "project_id": "app-12345",\n  "private_key": "..." \n}',
        topics: generateTopics(`[${selectedApp.name}]`)
      },
      local: {
        enabled: true,
        channels: generateChannels(`[${selectedApp.name}]`)
      },
      media: {
        enabled: true,
        channels: generateMediaChannels(`[${selectedApp.name}]`)
      }
    };
  });

  // State to track selections
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    config.fcm.topics.length > 0 ? config.fcm.topics[0].id : ''
  );
  
  const [selectedChannelId, setSelectedChannelId] = useState<string>(
     config.local.channels.length > 0 ? config.local.channels[0].id : ''
  );

  const [selectedMediaChannelId, setSelectedMediaChannelId] = useState<string>(
     config.media.channels.length > 0 ? config.media.channels[0].id : ''
  );

  // Auto-select first item when switching data sets/tabs if selection is empty
  useEffect(() => {
     if (activeTab === 'remote' && !selectedTopicId && config.fcm.topics.length > 0) {
         setSelectedTopicId(config.fcm.topics[0].id);
     }
     if (activeTab === 'local' && !selectedChannelId && config.local.channels.length > 0) {
         setSelectedChannelId(config.local.channels[0].id);
     }
     if (activeTab === 'media' && !selectedMediaChannelId && config.media.channels.length > 0) {
        setSelectedMediaChannelId(config.media.channels[0].id);
    }
  }, [activeTab, config, selectedTopicId, selectedChannelId, selectedMediaChannelId]);


  // Helpers
  const currentTopic = config.fcm.topics.find(t => t.id === selectedTopicId);
  const currentChannel = config.local.channels.find(c => c.id === selectedChannelId);
  const currentMediaChannel = config.media.channels.find(c => c.id === selectedMediaChannelId);

  // --- FCM Handlers ---
  const addTopic = () => {
    const newTopic: FCMTopic = {
      id: `topic_${Date.now()}`,
      name: 'new_topic',
      type: NotifType.DATA,
      priority: 'normal',
      intervalMins: 60,
      strategies: [{ id: `s_${Date.now()}`, title: '新标题', body: '新内容...', imageUrl: '' }]
    };
    setConfig(prev => ({
      ...prev,
      fcm: { ...prev.fcm, topics: [...prev.fcm.topics, newTopic] }
    }));
    setSelectedTopicId(newTopic.id);
  };

  const removeTopic = (id: string) => {
    const newTopics = config.fcm.topics.filter(t => t.id !== id);
    setConfig(prev => ({ ...prev, fcm: { ...prev.fcm, topics: newTopics } }));
    if (selectedTopicId === id && newTopics.length > 0) setSelectedTopicId(newTopics[0].id);
  };

  const updateTopic = (id: string, field: keyof FCMTopic, value: any) => {
    const newTopics = config.fcm.topics.map(t => t.id === id ? { ...t, [field]: value } : t);
    setConfig(prev => ({ ...prev, fcm: { ...prev.fcm, topics: newTopics } }));
  };

  const addStrategy = (topicId: string) => {
    const newStrategy: FCMStrategy = { id: `s_${Date.now()}`, title: '', body: '', imageUrl: '' };
    const newTopics = config.fcm.topics.map(t => {
      if (t.id === topicId) {
        return { ...t, strategies: [...t.strategies, newStrategy] };
      }
      return t;
    });
    setConfig(prev => ({ ...prev, fcm: { ...prev.fcm, topics: newTopics } }));
  };

  const removeStrategy = (topicId: string, strategyId: string) => {
    const newTopics = config.fcm.topics.map(t => {
      if (t.id === topicId) {
        return { ...t, strategies: t.strategies.filter(s => s.id !== strategyId) };
      }
      return t;
    });
    setConfig(prev => ({ ...prev, fcm: { ...prev.fcm, topics: newTopics } }));
  };

  const updateStrategy = (topicId: string, strategyId: string, field: keyof FCMStrategy, value: string) => {
    const newTopics = config.fcm.topics.map(t => {
      if (t.id === topicId) {
        const newStrategies = t.strategies.map(s => s.id === strategyId ? { ...s, [field]: value } : s);
        return { ...t, strategies: newStrategies };
      }
      return t;
    });
    setConfig(prev => ({ ...prev, fcm: { ...prev.fcm, topics: newTopics } }));
  };

  // --- Local Channel Handlers ---
  const addChannel = () => {
    const newChannel: LocalChannel = {
        id: `lc_${Date.now()}`,
        name: '新本地通知',
        firstSendDelayMins: 60,
        intervalMins: 1440,
        strategies: [{ id: `ls_${Date.now()}`, title: '默认标题', body: '默认详情', imageUrl: '' }]
    };
    setConfig(prev => ({
        ...prev,
        local: { ...prev.local, channels: [...prev.local.channels, newChannel] }
    }));
    setSelectedChannelId(newChannel.id);
  };

  const removeChannel = (id: string) => {
    const newChannels = config.local.channels.filter(c => c.id !== id);
    setConfig(prev => ({ ...prev, local: { ...prev.local, channels: newChannels } }));
    if (selectedChannelId === id && newChannels.length > 0) setSelectedChannelId(newChannels[0].id);
  };

  const updateChannel = (id: string, field: keyof LocalChannel, value: any) => {
    const newChannels = config.local.channels.map(c => c.id === id ? { ...c, [field]: value } : c);
    setConfig(prev => ({ ...prev, local: { ...prev.local, channels: newChannels } }));
  };

  const addLocalStrategy = (channelId: string) => {
    const newStrategy: LocalStrategy = { id: `ls_${Date.now()}`, title: '', body: '', imageUrl: '' };
    const newChannels = config.local.channels.map(c => {
      if (c.id === channelId) {
        return { ...c, strategies: [...c.strategies, newStrategy] };
      }
      return c;
    });
    setConfig(prev => ({ ...prev, local: { ...prev.local, channels: newChannels } }));
  };

  const removeLocalStrategy = (channelId: string, strategyId: string) => {
    const newChannels = config.local.channels.map(c => {
      if (c.id === channelId) {
        return { ...c, strategies: c.strategies.filter(s => s.id !== strategyId) };
      }
      return c;
    });
    setConfig(prev => ({ ...prev, local: { ...prev.local, channels: newChannels } }));
  };

  const updateLocalStrategy = (channelId: string, strategyId: string, field: keyof LocalStrategy, value: string) => {
    const newChannels = config.local.channels.map(c => {
      if (c.id === channelId) {
        const newStrategies = c.strategies.map(s => s.id === strategyId ? { ...s, [field]: value } : s);
        return { ...c, strategies: newStrategies };
      }
      return c;
    });
    setConfig(prev => ({ ...prev, local: { ...prev.local, channels: newChannels } }));
  };

  // --- Media Channel Handlers (Mirrors Local) ---
  const addMediaChannel = () => {
    const newChannel: MediaChannel = {
        id: `mc_${Date.now()}`,
        name: '新媒体通知',
        firstSendDelayMins: 30,
        intervalMins: 60,
        strategies: [{ id: `ms_${Date.now()}`, title: '默认标题', body: '默认详情', imageUrl: '' }]
    };
    setConfig(prev => ({
        ...prev,
        media: { ...prev.media, channels: [...prev.media.channels, newChannel] }
    }));
    setSelectedMediaChannelId(newChannel.id);
  };

  const removeMediaChannel = (id: string) => {
    const newChannels = config.media.channels.filter(c => c.id !== id);
    setConfig(prev => ({ ...prev, media: { ...prev.media, channels: newChannels } }));
    if (selectedMediaChannelId === id && newChannels.length > 0) setSelectedMediaChannelId(newChannels[0].id);
  };

  const updateMediaChannel = (id: string, field: keyof MediaChannel, value: any) => {
    const newChannels = config.media.channels.map(c => c.id === id ? { ...c, [field]: value } : c);
    setConfig(prev => ({ ...prev, media: { ...prev.media, channels: newChannels } }));
  };

  const addMediaStrategy = (channelId: string) => {
    const newStrategy: MediaStrategy = { id: `ms_${Date.now()}`, title: '', body: '', imageUrl: '' };
    const newChannels = config.media.channels.map(c => {
      if (c.id === channelId) {
        return { ...c, strategies: [...c.strategies, newStrategy] };
      }
      return c;
    });
    setConfig(prev => ({ ...prev, media: { ...prev.media, channels: newChannels } }));
  };

  const removeMediaStrategy = (channelId: string, strategyId: string) => {
    const newChannels = config.media.channels.map(c => {
      if (c.id === channelId) {
        return { ...c, strategies: c.strategies.filter(s => s.id !== strategyId) };
      }
      return c;
    });
    setConfig(prev => ({ ...prev, media: { ...prev.media, channels: newChannels } }));
  };

  const updateMediaStrategy = (channelId: string, strategyId: string, field: keyof MediaStrategy, value: string) => {
    const newChannels = config.media.channels.map(c => {
      if (c.id === channelId) {
        const newStrategies = c.strategies.map(s => s.id === strategyId ? { ...s, [field]: value } : s);
        return { ...c, strategies: newStrategies };
      }
      return c;
    });
    setConfig(prev => ({ ...prev, media: { ...prev.media, channels: newChannels } }));
  };

  // Preview Logic
  const getPreviewContent = () => {
    if (activeTab === 'media') {
        if (currentMediaChannel && currentMediaChannel.strategies.length > 0) {
            return { 
                title: currentMediaChannel.strategies[0].title,
                body: currentMediaChannel.strategies[0].body,
                image: currentMediaChannel.strategies[0].imageUrl 
            };
        }
        return { title: '', body: '请选择媒体通知 Channel', image: '' };
    }
    if (activeTab === 'local') {
      if (currentChannel && currentChannel.strategies.length > 0) {
          return { 
                title: currentChannel.strategies[0].title,
                body: currentChannel.strategies[0].body,
                image: currentChannel.strategies[0].imageUrl 
            };
      }
      return { title: '', body: '请选择本地通知 Channel', image: '' };
    }
    // Remote
    if (currentTopic && currentTopic.strategies.length > 0) {
      return { 
            title: currentTopic.strategies[0].title,
            body: currentTopic.strategies[0].body,
            image: currentTopic.strategies[0].imageUrl 
      };
    }
    return { title: '', body: '暂无配置策略', image: '' };
  };
  
  const previewData = getPreviewContent();

  const handleGlobalSwitch = (checked: boolean) => {
      if (checked) {
          setConfig({...config, globalEnabled: true});
      } else {
          // If global switch is turned off, turn off all sub-switches
          setConfig({
              ...config, 
              globalEnabled: false,
              fcm: { ...config.fcm, enabled: false },
              local: { ...config.local, enabled: false },
              media: { ...config.media, enabled: false }
          });
      }
  };

  const isGlobalDisabled = !config.globalEnabled;

  return (
    // Fix: replaced 'className' with 'class'
    <div class="space-y-6">
      <div class="flex items-center gap-2 mb-2">
         <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 uppercase tracking-wide">
           目标应用: {selectedApp.name}
         </span>
      </div>

      {/* Control Panel */}
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div class="flex items-center gap-3">
            <div class="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <Bell size={20} />
            </div>
            <div>
                <h3 class="font-semibold text-slate-800">通知系统总开关</h3>
                <p class="text-xs text-slate-500">控制所有下发通知的全局开关</p>
            </div>
            </div>
            <Switch 
                checked={config.globalEnabled} 
                onChange={handleGlobalSwitch} 
            />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* FCM Switch */}
            <div class={`flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 transition-opacity ${isGlobalDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div class="flex items-center gap-2">
                    <Radio size={16} class={config.fcm.enabled ? "text-blue-500" : "text-slate-400"} />
                    <span class={`text-sm font-medium ${config.fcm.enabled ? "text-slate-700" : "text-slate-400"}`}>FCM 远程推送</span>
                </div>
                <Switch size="small" checked={config.fcm.enabled} disabled={isGlobalDisabled} onChange={(v) => setConfig({...config, fcm: {...config.fcm, enabled: v}})} />
            </div>

            {/* Local Switch */}
            <div class={`flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 transition-opacity ${isGlobalDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div class="flex items-center gap-2">
                    <Clock size={16} class={config.local.enabled ? "text-emerald-500" : "text-slate-400"} />
                    <span class={`text-sm font-medium ${config.local.enabled ? "text-slate-700" : "text-slate-400"}`}>Local 本地通知</span>
                </div>
                <Switch size="small" checked={config.local.enabled} disabled={isGlobalDisabled} onChange={(v) => setConfig({...config, local: {...config.local, enabled: v}})} />
            </div>

            {/* Media Switch */}
            <div class={`flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 transition-opacity ${isGlobalDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div class="flex items-center gap-2">
                    <PlayCircle size={16} class={config.media.enabled ? "text-purple-500" : "text-slate-400"} />
                    <span class={`text-sm font-medium ${config.media.enabled ? "text-slate-700" : "text-slate-400"}`}>Media 媒体通知</span>
                </div>
                <Switch size="small" checked={config.media.enabled} disabled={isGlobalDisabled} onChange={(v) => setConfig({...config, media: {...config.media, enabled: v}})} />
            </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Editor Column */}
        <div class="lg:col-span-2 space-y-6">
          
          {/* Tabs */}
          <div class="flex gap-2 p-1 bg-slate-200/50 rounded-xl w-fit">
            <button 
              onClick={() => setActiveTab('remote')}
              class={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'remote' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              FCM 远程
            </button>
            <button 
              onClick={() => setActiveTab('local')}
              class={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'local' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Local 本地
            </button>
            <button 
              onClick={() => setActiveTab('media')}
              class={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'media' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Media 媒体
            </button>
          </div>

          {activeTab === 'remote' && (
            <Card title="FCM Topic 策略配置" class="space-y-0" action={
                 <div class="text-xs text-slate-400 flex items-center gap-1">
                   {currentTopic ? <span class="font-mono">{currentTopic.type === 'data' ? 'DataMsg' : 'Notification'}</span> : ''}
                 </div>
            }>
               {/* Global FCM Settings */}
               <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6 pb-6 border-b border-slate-100">
                 <div class="md:col-span-1">
                   <TextArea 
                      label="Firebase Key (JSON)" 
                      rows={1} 
                      value={config.fcm.jsonConfig} 
                      onChange={(e) => setConfig({...config, fcm: {...config.fcm, jsonConfig: (e.target as any).value}})}
                      class="font-mono text-xs"
                      placeholder="{ ... }"
                    />
                 </div>
               </div>

               {/* Topic Management Layout */}
               <div class="flex flex-col md:flex-row gap-6 min-h-[400px]">
                  
                  {/* Left: Topic List */}
                  <div class="w-full md:w-1/3 border-r border-slate-100 pr-0 md:pr-4 flex flex-col">
                     <div class="flex items-center justify-between mb-3">
                        <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Topics</span>
                        <Button size="small" icon={<Plus size={14}/>} onClick={() => addTopic()}>新建</Button>
                     </div>
                     <div class="space-y-2 flex-1 overflow-y-auto max-h-[400px]">
                        {config.fcm.topics.map(topic => (
                          <div 
                             key={topic.id}
                             onClick={() => setSelectedTopicId(topic.id)}
                             class={`p-3 rounded-lg border cursor-pointer transition-all relative group ${selectedTopicId === topic.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-100 hover:border-indigo-100'}`}
                          >
                             <div class="flex items-center gap-2 mb-1">
                                <Tag size={14} class={selectedTopicId === topic.id ? 'text-indigo-600' : 'text-slate-400'} />
                                <span class={`font-medium text-sm truncate ${selectedTopicId === topic.id ? 'text-indigo-900' : 'text-slate-600'}`}>
                                  {topic.name}
                                </span>
                             </div>
                             <div class="text-[10px] text-slate-400 pl-6 flex flex-col gap-0.5">
                               <span>{topic.type === NotifType.DATA ? 'Data' : 'Notice'} · {topic.priority}</span>
                               <span>间隔: {topic.intervalMins}m · {topic.strategies.length} 策略</span>
                             </div>
                             <button 
                                onClick={(e) => { e.stopPropagation(); removeTopic(topic.id); }}
                                class={`absolute right-2 top-3 text-slate-300 hover:text-red-500 transition-colors ${selectedTopicId === topic.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                             >
                                <Trash2 size={14} />
                             </button>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Right: Strategy Editor */}
                  <div class="w-full md:w-2/3 pl-0 md:pl-2">
                     {currentTopic ? (
                        <div class="space-y-4 animate-fade-in flex flex-col h-full">
                           <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                             <Input 
                                label="Topic 名称 (用于订阅)" 
                                value={currentTopic.name} 
                                onChange={(e) => updateTopic(currentTopic.id, 'name', (e.target as any).value)}
                                class="font-mono text-sm font-semibold text-indigo-900"
                             />
                             <div class="grid grid-cols-3 gap-4">
                                <Select 
                                    label="通道类型" 
                                    options={[{label: '透传 (Data)', value: 'data'}, {label: '通知 (Notification)', value: 'notice'}]}
                                    value={currentTopic.type}
                                    onChange={(e) => updateTopic(currentTopic.id, 'type', (e.target as any).value)}
                                />
                                <Select 
                                    label="优先级" 
                                    options={[{label: 'High', value: 'high'}, {label: 'Normal', value: 'normal'}, {label: 'Low', value: 'low'}]}
                                    value={currentTopic.priority}
                                    onChange={(e) => updateTopic(currentTopic.id, 'priority', (e.target as any).value)}
                                />
                                <Input 
                                    label="发送间隔 (mins)" 
                                    type="number" 
                                    value={currentTopic.intervalMins}
                                    onChange={(e) => updateTopic(currentTopic.id, 'intervalMins', parseInt((e.target as any).value))}
                                />
                             </div>
                           </div>

                           <div class="flex items-center justify-between mb-2">
                              <span class="text-xs font-bold text-slate-500 uppercase">文案策略池 ({currentTopic.strategies.length})</span>
                              <Button size="small" variant="secondary" icon={<Plus size={14}/>} onClick={() => addStrategy(currentTopic.id)}>添加文案</Button>
                           </div>

                           <div class="space-y-3 overflow-y-auto max-h-[450px] pr-2">
                              {currentTopic.strategies.map((strategy, index) => (
                                 <div key={strategy.id} class="relative p-4 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors bg-white group flex gap-3 items-start">
                                    {/* Index Badge */}
                                    <div class="w-6 h-6 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center text-xs font-bold border border-slate-200 shrink-0 mt-1">
                                      {index + 1}
                                    </div>
                                    
                                    <div class="space-y-2 flex-1">
                                       <Input 
                                          placeholder="标题" 
                                          value={strategy.title}
                                          onChange={(e) => updateStrategy(currentTopic.id, strategy.id, 'title', (e.target as any).value)}
                                          class="font-bold text-sm"
                                       />
                                       <TextArea 
                                          placeholder="详情内容" 
                                          rows={2}
                                          value={strategy.body}
                                          onChange={(e) => updateStrategy(currentTopic.id, strategy.id, 'body', (e.target as any).value)}
                                          class="text-sm resize-none"
                                       />
                                       <div class="flex gap-2">
                                          <div class="flex-1">
                                            <Input 
                                                placeholder="图片 URL (可选)" 
                                                value={strategy.imageUrl}
                                                onChange={(e) => updateStrategy(currentTopic.id, strategy.id, 'imageUrl', (e.target as any).value)}
                                                class="text-xs text-slate-500"
                                            />
                                          </div>
                                          {strategy.imageUrl && (
                                            <div class="w-8 h-8 rounded bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                                              <img src={strategy.imageUrl} class="w-full h-full object-cover" alt="preview" />
                                            </div>
                                          )}
                                       </div>
                                    </div>
                                    <button 
                                      onClick={() => removeStrategy(currentTopic.id, strategy.id)}
                                      class="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100 self-start"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ) : (
                        <div class="h-full flex flex-col items-center justify-center text-slate-400">
                          <Layers size={32} class="mb-2 opacity-50"/>
                          <p class="text-sm">请在左侧选择或新建 Topic</p>
                        </div>
                     )}
                  </div>
               </div>
            </Card>
          )}

          {activeTab === 'local' && (
            <Card title="本地通知 (按 Channel)" class="space-y-5">
               <div class="flex flex-col md:flex-row gap-6 min-h-[400px]">
                  
                  {/* Left: Channel List */}
                  <div class="w-full md:w-1/3 border-r border-slate-100 pr-0 md:pr-4 flex flex-col">
                     <div class="flex items-center justify-between mb-3">
                        <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Channels</span>
                        <Button size="small" icon={<Plus size={14}/>} onClick={() => addChannel()}>新建</Button>
                     </div>
                     <div class="space-y-2 flex-1 overflow-y-auto max-h-[400px]">
                        {config.local.channels.map(channel => (
                          <div 
                             key={channel.id}
                             onClick={() => setSelectedChannelId(channel.id)}
                             class={`p-3 rounded-lg border cursor-pointer transition-all relative group ${selectedChannelId === channel.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-100 hover:border-indigo-100'}`}
                          >
                             <div class="flex items-center gap-2 mb-1">
                                <Clock size={14} class={selectedChannelId === channel.id ? 'text-indigo-600' : 'text-slate-400'} />
                                <span class={`font-medium text-sm truncate ${selectedChannelId === channel.id ? 'text-indigo-900' : 'text-slate-600'}`}>
                                  {channel.name}
                                </span>
                             </div>
                             <div class="text-[10px] text-slate-400 pl-6 flex flex-col gap-0.5">
                               <span>延迟: {channel.firstSendDelayMins}m</span>
                               <span>循环: {channel.intervalMins}m</span>
                               <span>{channel.strategies.length} 条文案</span>
                             </div>
                             <button 
                                onClick={(e) => { e.stopPropagation(); removeChannel(channel.id); }}
                                class={`absolute right-2 top-3 text-slate-300 hover:text-red-500 transition-colors ${selectedChannelId === channel.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                             >
                                <Trash2 size={14} />
                             </button>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Right: Channel Detail Editor */}
                  <div class="w-full md:w-2/3 pl-0 md:pl-2">
                     {currentChannel ? (
                        <div class="space-y-5 animate-fade-in flex flex-col h-full">
                           <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                              <Input 
                                 label="Channel 名称 (内部标识)" 
                                 value={currentChannel.name}
                                 onChange={(e) => updateChannel(currentChannel.id, 'name', (e.target as any).value)}
                                 class="font-semibold"
                              />
                              <div class="grid grid-cols-2 gap-4">
                                <Input 
                                  label="首次发送延迟 (分钟)" 
                                  type="number" 
                                  value={currentChannel.firstSendDelayMins}
                                  onChange={(e) => updateChannel(currentChannel.id, 'firstSendDelayMins', parseInt((e.target as any).value))}
                                />
                                <Input 
                                  label="重复频次 (分钟)" 
                                  type="number" 
                                  value={currentChannel.intervalMins}
                                  onChange={(e) => updateChannel(currentChannel.id, 'intervalMins', parseInt((e.target as any).value))}
                                />
                              </div>
                           </div>
                           
                           <div class="flex items-center justify-between mb-2 mt-4">
                              <span class="text-xs font-bold text-slate-500 uppercase">文案策略池 ({currentChannel.strategies.length})</span>
                              <Button size="small" variant="secondary" icon={<Plus size={14}/>} onClick={() => addLocalStrategy(currentChannel.id)}>添加文案</Button>
                           </div>

                           <div class="space-y-3 overflow-y-auto max-h-[350px] pr-2">
                              {currentChannel.strategies.map((strategy, index) => (
                                 <div key={strategy.id} class="relative p-4 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors bg-white group flex gap-3 items-start">
                                    <div class="w-6 h-6 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center text-xs font-bold border border-slate-200 shrink-0 mt-1">
                                      {index + 1}
                                    </div>
                                    <div class="space-y-2 flex-1">
                                       <Input 
                                          placeholder="标题" 
                                          value={strategy.title}
                                          onChange={(e) => updateLocalStrategy(currentChannel.id, strategy.id, 'title', (e.target as any).value)}
                                          class="font-bold text-sm"
                                       />
                                       <TextArea 
                                          placeholder="详情内容" 
                                          rows={2}
                                          value={strategy.body}
                                          onChange={(e) => updateLocalStrategy(currentChannel.id, strategy.id, 'body', (e.target as any).value)}
                                          class="text-sm resize-none"
                                       />
                                       <div class="flex gap-2">
                                          <div class="flex-1">
                                            <Input 
                                                placeholder="图片 URL (可选)" 
                                                value={strategy.imageUrl}
                                                onChange={(e) => updateLocalStrategy(currentChannel.id, strategy.id, 'imageUrl', (e.target as any).value)}
                                                class="text-xs text-slate-500"
                                            />
                                          </div>
                                          {strategy.imageUrl && (
                                            <div class="w-8 h-8 rounded bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                                              <img src={strategy.imageUrl} class="w-full h-full object-cover" alt="preview" />
                                            </div>
                                          )}
                                       </div>
                                    </div>
                                    <button 
                                      onClick={() => removeLocalStrategy(currentChannel.id, strategy.id)}
                                      class="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100 self-start"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                 </div>
                              ))}
                              {currentChannel.strategies.length === 0 && (
                                <div class="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                                  请添加至少一条本地文案
                                </div>
                              )}
                           </div>
                        </div>
                     ) : (
                        <div class="h-full flex flex-col items-center justify-center text-slate-400">
                          <Layers size={32} class="mb-2 opacity-50"/>
                          <p class="text-sm">请在左侧选择或新建 Channel</p>
                        </div>
                     )}
                  </div>
               </div>
            </Card>
          )}

          {activeTab === 'media' && (
            <Card title="媒体通知 (按 Channel)" class="space-y-5">
               <div class="flex flex-col md:flex-row gap-6 min-h-[400px]">
                  
                  {/* Left: Channel List */}
                  <div class="w-full md:w-1/3 border-r border-slate-100 pr-0 md:pr-4 flex flex-col">
                     <div class="flex items-center justify-between mb-3">
                        <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Media Channels</span>
                        <Button size="small" icon={<Plus size={14}/>} onClick={() => addMediaChannel()}>新建</Button>
                     </div>
                     <div class="space-y-2 flex-1 overflow-y-auto max-h-[400px]">
                        {config.media.channels.map(channel => (
                          <div 
                             key={channel.id}
                             onClick={() => setSelectedMediaChannelId(channel.id)}
                             class={`p-3 rounded-lg border cursor-pointer transition-all relative group ${selectedMediaChannelId === channel.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-100 hover:border-indigo-100'}`}
                          >
                             <div class="flex items-center gap-2 mb-1">
                                <PlayCircle size={14} class={selectedMediaChannelId === channel.id ? 'text-indigo-600' : 'text-slate-400'} />
                                <span class={`font-medium text-sm truncate ${selectedMediaChannelId === channel.id ? 'text-indigo-900' : 'text-slate-600'}`}>
                                  {channel.name}
                                </span>
                             </div>
                             <div class="text-[10px] text-slate-400 pl-6 flex flex-col gap-0.5">
                               <span>延迟: {channel.firstSendDelayMins}m</span>
                               <span>循环: {channel.intervalMins}m</span>
                               <span>{channel.strategies.length} 条文案</span>
                             </div>
                             <button 
                                onClick={(e) => { e.stopPropagation(); removeMediaChannel(channel.id); }}
                                class={`absolute right-2 top-3 text-slate-300 hover:text-red-500 transition-colors ${selectedMediaChannelId === channel.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                             >
                                <Trash2 size={14} />
                             </button>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Right: Channel Detail Editor */}
                  <div class="w-full md:w-2/3 pl-0 md:pl-2">
                     {currentMediaChannel ? (
                        <div class="space-y-5 animate-fade-in flex flex-col h-full">
                           <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                              <Input 
                                 label="Channel 名称 (内部标识)" 
                                 value={currentMediaChannel.name}
                                 onChange={(e) => updateMediaChannel(currentMediaChannel.id, 'name', (e.target as any).value)}
                                 class="font-semibold"
                              />
                              <div class="grid grid-cols-2 gap-4">
                                <Input 
                                  label="首次发送延迟 (分钟)" 
                                  type="number" 
                                  value={currentMediaChannel.firstSendDelayMins}
                                  onChange={(e) => updateMediaChannel(currentMediaChannel.id, 'firstSendDelayMins', parseInt((e.target as any).value))}
                                />
                                <Input 
                                  label="重复频次 (分钟)" 
                                  type="number" 
                                  value={currentMediaChannel.intervalMins}
                                  onChange={(e) => updateMediaChannel(currentMediaChannel.id, 'intervalMins', parseInt((e.target as any).value))}
                                />
                              </div>
                           </div>
                           
                           <div class="flex items-center justify-between mb-2 mt-4">
                              <span class="text-xs font-bold text-slate-500 uppercase">文案策略池 ({currentMediaChannel.strategies.length})</span>
                              <Button size="small" variant="secondary" icon={<Plus size={14}/>} onClick={() => addMediaStrategy(currentMediaChannel.id)}>添加文案</Button>
                           </div>

                           <div class="space-y-3 overflow-y-auto max-h-[350px] pr-2">
                              {currentMediaChannel.strategies.map((strategy, index) => (
                                 <div key={strategy.id} class="relative p-4 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors bg-white group flex gap-3 items-start">
                                    <div class="w-6 h-6 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center text-xs font-bold border border-slate-200 shrink-0 mt-1">
                                      {index + 1}
                                    </div>
                                    <div class="space-y-2 flex-1">
                                       <Input 
                                          placeholder="标题" 
                                          value={strategy.title}
                                          onChange={(e) => updateMediaStrategy(currentMediaChannel.id, strategy.id, 'title', (e.target as any).value)}
                                          class="font-bold text-sm"
                                       />
                                       <TextArea 
                                          placeholder="详情内容" 
                                          rows={2}
                                          value={strategy.body}
                                          onChange={(e) => updateMediaStrategy(currentMediaChannel.id, strategy.id, 'body', (e.target as any).value)}
                                          class="text-sm resize-none"
                                       />
                                       <div class="flex gap-2">
                                          <div class="flex-1">
                                            <Input 
                                                placeholder="图片 URL (可选)" 
                                                value={strategy.imageUrl}
                                                onChange={(e) => updateMediaStrategy(currentMediaChannel.id, strategy.id, 'imageUrl', (e.target as any).value)}
                                                class="text-xs text-slate-500"
                                            />
                                          </div>
                                          {strategy.imageUrl && (
                                            <div class="w-8 h-8 rounded bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                                              <img src={strategy.imageUrl} class="w-full h-full object-cover" alt="preview" />
                                            </div>
                                          )}
                                       </div>
                                    </div>
                                    <button 
                                      onClick={() => removeMediaStrategy(currentMediaChannel.id, strategy.id)}
                                      class="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100 self-start"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                 </div>
                              ))}
                              {currentMediaChannel.strategies.length === 0 && (
                                <div class="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                                  请添加至少一条媒体文案
                                </div>
                              )}
                           </div>
                        </div>
                     ) : (
                        <div class="h-full flex flex-col items-center justify-center text-slate-400">
                          <Layers size={32} class="mb-2 opacity-50"/>
                          <p class="text-sm">请在左侧选择或新建 Channel</p>
                        </div>
                     )}
                  </div>
               </div>
            </Card>
          )}

        </div>

        {/* Preview Column */}
        <div class="space-y-6">
          <Card title="预览">
            <div class="bg-slate-900 rounded-[2rem] p-3 border-4 border-slate-800 shadow-2xl mx-auto w-64">
              <div class="bg-white rounded-[1.5rem] overflow-hidden h-96 relative">
                 {/* Fake Status Bar */}
                 <div class="h-6 bg-slate-100 flex justify-between px-4 items-center text-[10px] text-slate-500 font-bold">
                    <span>9:41</span>
                    <span>5G</span>
                 </div>
                 
                 {/* Fake App UI */}
                 <div class="p-4 space-y-2">
                    <div class="h-20 bg-slate-100 rounded-xl animate-pulse"></div>
                    <div class="h-32 bg-slate-100 rounded-xl animate-pulse"></div>
                 </div>

                 {/* Notification Modal / Banner */}
                 <div class="absolute top-2 left-2 right-2 bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-3 border border-slate-100 z-10 transition-all duration-300">
                    <div class="flex gap-3">
                       <div class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                         {activeTab === 'media' ? <PlayCircle class="text-white w-5 h-5" /> : <Bell class="text-white w-5 h-5" />}
                       </div>
                       <div class="flex-1 min-w-0">
                         <div class="flex justify-between items-start">
                           <p class="font-bold text-xs text-slate-900">{selectedApp.name}</p>
                           <span class="text-[10px] text-slate-400">now</span>
                         </div>
                         <div class="mt-1">
                            <p class="text-xs font-bold text-slate-800 line-clamp-1">{previewData.title || '通知标题'}</p>
                            <p class="text-xs text-slate-600 line-clamp-2 leading-tight mt-0.5">
                            {previewData.body || '通知详情内容...'}
                            </p>
                         </div>
                       </div>
                    </div>
                    {previewData.image && (
                      <div class="mt-2 h-24 bg-slate-100 rounded-lg overflow-hidden relative">
                        <img 
                          src={previewData.image} 
                          alt="Notif" 
                          class="w-full h-full object-cover"
                          // Fix: casting currentTarget to HTMLImageElement
                          onError={(e: any) => (e.currentTarget.style.display = 'none')}
                        />
                        <div class="absolute inset-0 flex items-center justify-center text-slate-300 -z-10">
                            <ImageIcon size={24} />
                        </div>
                      </div>
                    )}
                 </div>
              </div>
            </div>
            <div class="mt-6 text-center space-y-2">
              <Button variant="secondary" class="w-full">发送测试消息</Button>
              {activeTab === 'remote' && currentTopic && (
                 <p class="text-[10px] text-slate-400">
                   当前展示 Topic: <span class="font-mono text-slate-600">{currentTopic.name}</span> (Strategy 1/{currentTopic.strategies.length})
                 </p>
              )}
               {activeTab === 'local' && currentChannel && (
                 <p class="text-[10px] text-slate-400">
                   当前展示 Channel: <span class="font-mono text-slate-600">{currentChannel.name}</span> (Strategy 1/{currentChannel.strategies.length})
                 </p>
              )}
               {activeTab === 'media' && currentMediaChannel && (
                 <p class="text-[10px] text-slate-400">
                   当前展示 Channel: <span class="font-mono text-slate-600">{currentMediaChannel.name}</span> (Strategy 1/{currentMediaChannel.strategies.length})
                 </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
