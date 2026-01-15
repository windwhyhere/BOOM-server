
import React, { useState, useMemo } from 'react';
import { EconomyConfig, EconomyRule, AppProfile, WithdrawalTask } from '../types';
import { Card, Input } from '../components/UI';
import { Coins, Zap, Plus, Trash2, ArrowRight, Settings2, ListTodo, Calendar, Hash, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { InputNumber, Table, Button, Typography, Tooltip, Tag, Space, Input as AntInput, Switch, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;
const { TextArea } = AntInput;

interface EconomyViewProps {
  selectedApp: AppProfile;
}

export const EconomyView: React.FC<EconomyViewProps> = ({ selectedApp }) => {
  const [config, setConfig] = useState<EconomyConfig>(() => {
    // Initial Mock Data
    const defaultQueue = {
        enabled: true,
        initialRank: 100,
        totalRank: 500,
        advancements: [100, 100, 100, 50, 50] // Sum = 400
    };

    if (selectedApp.id === 'app_3') {
        return {
            rhythmKeys: ['基础产出', '签到奖励'],
            rules: [
                { id: '1', minBalance: 0, maxBalance: 50, interstitialProb: 20, rewardedProb: 40, rhythms: { '基础产出': 50, '签到奖励': 100 } },
            ],
            withdrawalTasks: [
                { id: '1', name: '每日登录', count: 1, days: undefined }
            ],
            queue: defaultQueue
        }
    }
    return {
        rhythmKeys: ['Quiz答题', 'Lucky转盘', '刮刮卡'],
        rules: [
            { id: '1', minBalance: 0, maxBalance: 100, interstitialProb: 30, rewardedProb: 50, rhythms: { 'Quiz答题': 30, 'Lucky转盘': 100, '刮刮卡': 50 } },
            { id: '2', minBalance: 100, maxBalance: 200, interstitialProb: 50, rewardedProb: 70, rhythms: { 'Quiz答题': 20, 'Lucky转盘': 80, '刮刮卡': 40 } },
            { id: '3', minBalance: 200, maxBalance: 9999, interstitialProb: 80, rewardedProb: 90, rhythms: { 'Quiz答题': 10, 'Lucky转盘': 50, '刮刮卡': 20 } },
        ],
        withdrawalTasks: [
            { id: 't1', name: '观看激励视频 (需完整观看且点击)', count: 20, days: undefined },
            { id: 't2', name: '连续签到 (漏签需补签)', count: undefined, days: 3 },
            { id: 't3', name: '限时冲刺活动 - 邀请3名好友', count: 50, days: 5 },
        ],
        queue: {
            enabled: true,
            initialRank: 50,
            totalRank: 200,
            advancements: [50, 30, 20, 10, 10, 10, 10, 10] // Sum = 150
        }
    };
  });

  // Local state for the advancement text area to allow free typing before parsing
  const [advancementInput, setAdvancementInput] = useState(config.queue.advancements.join(', '));

  const [newKeyInput, setNewKeyInput] = useState('');
  const [isAddingKey, setIsAddingKey] = useState(false);

  // --- Queue Handlers ---
  const handleAdvancementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setAdvancementInput(val);

    // Allow digits, commas, spaces
    const numbers = val.split(/[,，\s]+/).map(v => parseInt(v)).filter(n => !isNaN(n));
    setConfig(prev => ({
        ...prev,
        queue: { ...prev.queue, advancements: numbers }
    }));
  };

  const queueValidation = useMemo(() => {
    const { initialRank, totalRank, advancements } = config.queue;
    const targetDiff = totalRank - initialRank;
    const currentSum = advancements.reduce((a, b) => a + b, 0);
    const isValid = targetDiff === currentSum;
    
    return { targetDiff, currentSum, isValid };
  }, [config.queue]);

  // --- Rules Handlers ---
  const handleAddRule = () => {
    const newRule: EconomyRule = {
        id: Date.now().toString(),
        minBalance: 0,
        maxBalance: 100,
        interstitialProb: 50,
        rewardedProb: 50,
        rhythms: {}
    };
    config.rhythmKeys.forEach(key => {
        newRule.rhythms[key] = 0;
    });
    setConfig(prev => ({ ...prev, rules: [...prev.rules, newRule] }));
  };

  const handleDeleteRule = (id: string) => {
    setConfig(prev => ({ ...prev, rules: prev.rules.filter(r => r.id !== id) }));
  };

  const updateRule = (id: string, field: keyof EconomyRule, value: any) => {
    setConfig(prev => ({
        ...prev,
        rules: prev.rules.map(r => r.id === id ? { ...r, [field]: value } : r)
    }));
  };

  const updateRhythmValue = (ruleId: string, key: string, value: number | null) => {
    if (value === null) return;
    setConfig(prev => ({
        ...prev,
        rules: prev.rules.map(r => r.id === ruleId ? { 
            ...r, 
            rhythms: { ...r.rhythms, [key]: value }
        } : r)
    }));
  };

  const handleAddKey = () => {
    if (newKeyInput && !config.rhythmKeys.includes(newKeyInput)) {
        setConfig(prev => ({
            ...prev,
            rhythmKeys: [...prev.rhythmKeys, newKeyInput],
            rules: prev.rules.map(r => ({
                ...r,
                rhythms: { ...r.rhythms, [newKeyInput]: 0 }
            }))
        }));
        setNewKeyInput('');
        setIsAddingKey(false);
    }
  };

  const handleRemoveKey = (keyToRemove: string) => {
      setConfig(prev => ({
          ...prev,
          rhythmKeys: prev.rhythmKeys.filter(k => k !== keyToRemove),
          rules: prev.rules.map(r => {
              const newRhythms = { ...r.rhythms };
              delete newRhythms[keyToRemove];
              return { ...r, rhythms: newRhythms };
          })
      }));
  };

  // --- Tasks Handlers ---
  const handleAddTask = () => {
    const newTask: WithdrawalTask = {
        id: `t_${Date.now()}`,
        name: '新任务',
        count: 10,
        days: undefined
    };
    setConfig(prev => ({ ...prev, withdrawalTasks: [...prev.withdrawalTasks, newTask] }));
  }

  const handleDeleteTask = (id: string) => {
    setConfig(prev => ({ ...prev, withdrawalTasks: prev.withdrawalTasks.filter(t => t.id !== id) }));
  }

  const updateTask = (id: string, field: keyof WithdrawalTask, value: any) => {
    setConfig(prev => ({
        ...prev,
        withdrawalTasks: prev.withdrawalTasks.map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  }

  // --- Columns Configuration ---
  const baseColumns: ColumnsType<EconomyRule> = [
    {
        title: '余额区间 (USD)',
        key: 'range',
        width: 180,
        fixed: 'left',
        render: (_, record) => (
            <div class="flex items-center gap-1">
                <InputNumber 
                    min={0}
                    value={record.minBalance}
                    onChange={(v) => updateRule(record.id, 'minBalance', v)}
                    class="w-[70px] text-xs"
                    prefix="$"
                    controls={false}
                />
                <ArrowRight size={12} class="text-slate-400 shrink-0" />
                <InputNumber 
                    min={0}
                    value={record.maxBalance}
                    onChange={(v) => updateRule(record.id, 'maxBalance', v)}
                    class="w-[70px] text-xs"
                    prefix="$"
                    controls={false}
                />
            </div>
        )
    },
    {
        title: '广告概率',
        key: 'ads',
        width: 160,
        render: (_, record) => (
            <div class="flex flex-col gap-1">
                 <div class="flex items-center justify-between">
                    <span class="text-[10px] text-slate-500 uppercase w-8">插屏</span>
                    <InputNumber 
                        size="small"
                        min={0} max={100}
                        value={record.interstitialProb}
                        onChange={(v) => updateRule(record.id, 'interstitialProb', v)}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value?.replace('%', '') as unknown as number}
                        class="w-20"
                    />
                 </div>
                 <div class="flex items-center justify-between">
                    <span class="text-[10px] text-slate-500 uppercase w-8">激励</span>
                    <InputNumber 
                        size="small"
                        min={0} max={100}
                        value={record.rewardedProb}
                        onChange={(v) => updateRule(record.id, 'rewardedProb', v)}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value?.replace('%', '') as unknown as number}
                        class="w-20"
                    />
                 </div>
            </div>
        )
    }
  ];

  const rhythmColumns: ColumnsType<EconomyRule> = config.rhythmKeys.map(key => ({
      title: <span class="text-xs text-indigo-600 font-medium">{key}</span>,
      dataIndex: ['rhythms', key],
      key: `rhythm_${key}`,
      width: 100,
      render: (val, record) => (
           <InputNumber 
              value={val ?? 0} 
              onChange={v => updateRhythmValue(record.id, key, v)} 
              class="w-full"
              controls={false}
           />
      )
  }));

  const actionColumn: ColumnsType<EconomyRule>[0] = {
      title: '操作',
      key: 'action',
      width: 50,
      fixed: 'right',
      render: (_, record) => (
          <Button 
              type="text" 
              danger 
              icon={<Trash2 size={14} />} 
              onClick={() => handleDeleteRule(record.id)}
          />
      )
  };

  const columns = [...baseColumns, ...rhythmColumns, actionColumn];

  const taskColumns: ColumnsType<WithdrawalTask> = [
    {
        title: '任务名称 / 详情描述',
        dataIndex: 'name',
        key: 'name',
        // Removed fixed width to allow expansion
        render: (val, record) => (
            <div class="flex items-start gap-2 py-1">
                <ListTodo size={16} class="text-slate-400 mt-2.5 shrink-0"/>
                <TextArea 
                    value={val} 
                    onChange={(e) => updateTask(record.id, 'name', (e.target as any).value)} 
                    placeholder="输入任务详情..."
                    autoSize={{ minRows: 2, maxRows: 6 }} 
                    class="text-sm"
                />
            </div>
        )
    },
    {
        title: '次数要求',
        dataIndex: 'count',
        key: 'count',
        width: 130,
        render: (val, record) => (
            <div class="flex flex-col justify-start h-full">
                <InputNumber 
                    value={val} 
                    onChange={(v) => updateTask(record.id, 'count', v)} 
                    placeholder="无限制"
                    class="w-full"
                    prefix={<Hash size={14} class="text-slate-400 mr-1"/>}
                />
            </div>
        )
    },
    {
        title: '天数要求 (内)',
        dataIndex: 'days',
        key: 'days',
        width: 130,
        render: (val, record) => (
            <div class="flex flex-col justify-start h-full">
                <InputNumber 
                    value={val} 
                    onChange={(v) => updateTask(record.id, 'days', v)} 
                    placeholder="无限制"
                    class="w-full"
                    suffix={<span class="text-xs text-slate-400">天</span>}
                    prefix={<Calendar size={14} class="text-slate-400 mr-1"/>}
                />
            </div>
        )
    },
    {
        title: '操作',
        key: 'action',
        width: 60,
        align: 'center',
        render: (_, record) => (
            <Button 
                type="text" 
                danger 
                icon={<Trash2 size={16} />} 
                onClick={() => handleDeleteTask(record.id)}
            />
        )
    }
  ];

  return (
    // Fix: replaced 'className' with 'class'
    <div class="space-y-6">
      <div class="flex items-center gap-2 mb-2">
         <span class="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100 uppercase tracking-wide">
           网赚数值: {selectedApp.name}
         </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Rules Table (Full Width) */}
        <div class="lg:col-span-2">
            <Card 
                title="分层数值策略" 
                action={<Button size="small" type="primary" icon={<Plus size={14}/>} onClick={handleAddRule}>添加区间</Button>}
                class="overflow-hidden"
            >
            <div class="bg-slate-50 p-4 rounded-xl mb-5 border border-slate-100">
                <div class="flex items-center gap-2 mb-2">
                    <Settings2 size={14} class="text-slate-500" />
                    <span class="text-xs font-bold text-slate-700 uppercase">产出类型 definition (Rhythm Fields)</span>
                </div>
                <div class="flex flex-wrap gap-2 items-center">
                    {config.rhythmKeys.map(key => (
                        <Tag 
                            key={key} 
                            closable 
                            onClose={() => handleRemoveKey(key)}
                            color="blue"
                            class="mr-0"
                        >
                            {key}
                        </Tag>
                    ))}
                    
                    {isAddingKey ? (
                        <AntInput
                            autoFocus
                            type="text"
                            size="small"
                            style={{ width: 100 }}
                            value={newKeyInput}
                            onChange={(e) => setNewKeyInput(e.target.value)}
                            onBlur={handleAddKey}
                            onPressEnter={handleAddKey}
                            placeholder="输入名称"
                        />
                    ) : (
                        <Tag 
                            onClick={() => setIsAddingKey(true)} 
                            class="border-dashed bg-white hover:border-indigo-400 cursor-pointer mr-0 flex items-center gap-1"
                        >
                            <Plus size={10} /> 新增类型
                        </Tag>
                    )}
                </div>
                <p class="text-[10px] text-slate-400 mt-2">
                    在此处定义的类型将自动作为列添加到下方的策略表中。适用于答题、转盘、签到等多种产出场景。
                </p>
            </div>
            
            <Table 
                dataSource={config.rules} 
                columns={columns} 
                rowKey="id"
                pagination={false}
                size="middle"
                bordered
                scroll={{ x: 'max-content' }}
            />
            </Card>
        </div>

        {/* Withdrawal Tasks */}
        <Card title="提现后续任务配置" class="lg:col-span-2" action={<Button size="small" icon={<Plus size={16}/>} onClick={() => handleAddTask()}>添加任务</Button>}>
           <div class="space-y-4">
               <div class="bg-orange-50 p-3 rounded-lg text-xs text-orange-700 border border-orange-100 flex items-center gap-2">
                  <Zap size={14} />
                  <span>
                    配置用户发起提现申请后需要完成的任务。任务名称支持长文本输入，方便记录详细要求。
                  </span>
               </div>
               
               <Table 
                 dataSource={config.withdrawalTasks}
                 columns={taskColumns}
                 rowKey="id"
                 pagination={false}
                 size="middle"
               />
           </div>
        </Card>

        {/* Queue Config */}
        <Card 
            title="排队功能配置" 
            class="lg:col-span-2"
            action={
                <Switch 
                    checkedChildren="开启" 
                    unCheckedChildren="关闭" 
                    checked={config.queue.enabled}
                    onChange={(v) => setConfig(p => ({ ...p, queue: { ...p.queue, enabled: v } }))}
                />
            }
        >
            <div class={`space-y-6 transition-all ${config.queue.enabled ? 'opacity-100' : 'opacity-50 grayscale pointer-events-none'}`}>
                <div class="flex gap-4">
                    <div class="flex-1">
                        <Text class="block text-xs font-semibold text-slate-500 mb-1">初始排名 (Initial Rank)</Text>
                        <InputNumber 
                            value={config.queue.initialRank}
                            onChange={v => v !== null && setConfig(p => ({ ...p, queue: { ...p.queue, initialRank: v } }))}
                            class="w-full"
                            min={0}
                        />
                    </div>
                    <div class="flex-1">
                        <Text class="block text-xs font-semibold text-slate-500 mb-1">总的排名 (Total Rank)</Text>
                        <InputNumber 
                            value={config.queue.totalRank}
                            onChange={v => v !== null && setConfig(p => ({ ...p, queue: { ...p.queue, totalRank: v } }))}
                            class="w-full"
                            min={0}
                        />
                    </div>
                </div>

                <div>
                    <Text class="block text-xs font-semibold text-slate-500 mb-1">
                        前进排名数组 (逗号分隔)
                    </Text>
                    <TextArea 
                        rows={2}
                        value={advancementInput}
                        onChange={handleAdvancementsChange}
                        placeholder="例如: 20, 10, 10, 5"
                        class="font-mono"
                    />
                    <div class="mt-2 flex items-center gap-2 text-xs">
                        <Users size={12} class="text-slate-400"/>
                        <span class="text-slate-500">
                             当前 {config.queue.advancements.length} 个任务节点
                        </span>
                    </div>
                </div>

                {/* Validation Status */}
                <div class={`p-3 rounded-lg border flex items-start gap-3 ${queueValidation.isValid ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {queueValidation.isValid ? <CheckCircle2 size={18} class="mt-0.5 shrink-0"/> : <AlertCircle size={18} class="mt-0.5 shrink-0"/>}
                    <div class="flex-1">
                        <div class="font-semibold text-sm">
                            {queueValidation.isValid ? '配置校验通过' : '配置校验未通过'}
                        </div>
                        <div class="text-xs mt-1 opacity-90">
                            目标差值 (Total - Initial): <strong>{queueValidation.targetDiff}</strong>
                            <br/>
                            当前数组总和 (Sum): <strong>{queueValidation.currentSum}</strong>
                        </div>
                        {!queueValidation.isValid && (
                             <div class="text-xs mt-2 font-mono bg-white/50 p-1 rounded w-fit px-2 border border-red-100">
                                差值: {queueValidation.targetDiff - queueValidation.currentSum}
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>

      </div>
    </div>
  );
};
