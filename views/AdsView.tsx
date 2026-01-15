
import React, { useState } from 'react';
import { AdConfig, AdAggregationType, AppProfile, AdStrategyDef, AdTrafficRule } from '../types';
import { Card, Select, Input, Button, Badge, Switch } from '../components/UI';
import { Plus, Trash2, Layers, Globe, Users, BarChart, Settings, Megaphone, GripVertical, AlertCircle, PieChart } from 'lucide-react';
import { Modal, Form, Input as AntInput, Select as AntSelect, Slider, Progress, Tag, Tooltip } from 'antd';

const { Option } = AntSelect;

interface AdsViewProps {
  selectedApp: AppProfile;
}

const PRESET_CHANNELS = ['Organic (自然量)', 'Facebook', 'Google Ads', 'Applovin', 'MTG', 'Unity Ads', 'IronSource', 'TikTok'];
const PRESET_USER_LEVELS = ['所有用户', '新用户 (0天)', '老用户 (3天+)', '高价值 (ARPU>$5)', '非付费用户'];
const PRESET_PROVIDERS = ['TopOn', 'Max', 'Admob', 'TradPlus', 'IronSource'];

export const AdsView: React.FC<AdsViewProps> = ({ selectedApp }) => {
  // --- State Initialization ---
  const [config, setConfig] = useState<AdConfig>(() => {
    // Mock Data
    const strategies: AdStrategyDef[] = [
        { id: 'str_1', name: 'TopOn 主流策略', aggregationType: AdAggregationType.SINGLE, provider: 'TopOn' },
        { id: 'str_2', name: 'Max 激进 Waterfall', aggregationType: AdAggregationType.WATERFALL, provider: 'Max' },
        { id: 'str_3', name: 'Admob 保底', aggregationType: AdAggregationType.SINGLE, provider: 'Admob' },
    ];

    const rules: AdTrafficRule[] = [
        {
            id: 'rule_1',
            name: '美国买量高价策略',
            priority: 1,
            enabled: true,
            conditions: {
                channels: ['MTG', 'Facebook'],
                countries: ['US', 'CA'],
                userLevel: '新用户 (0天)'
            },
            allocations: [
                { strategyId: 'str_1', percentage: 50 },
                { strategyId: 'str_2', percentage: 50 }
            ]
        },
        {
            id: 'rule_2',
            name: '全局兜底配置',
            priority: 99,
            enabled: true,
            conditions: {
                channels: ['所有渠道'],
                countries: ['全球'],
                userLevel: '所有用户'
            },
            allocations: [
                { strategyId: 'str_3', percentage: 100 }
            ]
        }
    ];

    return { strategies, rules };
  });

  // --- Modal States ---
  const [isStratModalOpen, setIsStratModalOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingStrat, setEditingStrat] = useState<AdStrategyDef | null>(null);
  const [editingRule, setEditingRule] = useState<AdTrafficRule | null>(null);
  const [form] = Form.useForm();
  const [ruleForm] = Form.useForm();

  // --- Handlers: Strategies ---
  const handleSaveStrategy = (values: any) => {
    if (editingStrat) {
        setConfig(prev => ({
            ...prev,
            strategies: prev.strategies.map(s => s.id === editingStrat.id ? { ...editingStrat, ...values } : s)
        }));
    } else {
        const newStrat: AdStrategyDef = {
            id: `str_${Date.now()}`,
            ...values
        };
        setConfig(prev => ({ ...prev, strategies: [...prev.strategies, newStrat] }));
    }
    setIsStratModalOpen(false);
    form.resetFields();
    setEditingStrat(null);
  };

  const deleteStrategy = (id: string) => {
      setConfig(prev => ({
          ...prev,
          strategies: prev.strategies.filter(s => s.id !== id),
          // Remove this strategy from any rules
          rules: prev.rules.map(r => ({
              ...r,
              allocations: r.allocations.filter(a => a.strategyId !== id)
          }))
      }));
  };

  const openStratModal = (strat?: AdStrategyDef) => {
      setEditingStrat(strat || null);
      form.setFieldsValue(strat || { aggregationType: AdAggregationType.SINGLE, provider: 'TopOn' });
      setIsStratModalOpen(true);
  };

  // --- Handlers: Rules ---
  const handleSaveRule = (values: any) => {
      const { name, priority, channels, countries, userLevel, allocations } = values;
      
      // Allocations come in as { strat_ID: percentage }. Need to convert to array.
      // Logic inside the Form (Dynamic Fields) handles the UI, but here we process the result.
      
      const processedAllocations = Object.keys(allocations || {}).map(key => ({
          strategyId: key,
          percentage: allocations[key]
      })).filter(a => a.percentage > 0);

      const newRuleData = {
          name,
          priority,
          enabled: editingRule ? editingRule.enabled : true,
          conditions: {
              channels,
              countries,
              userLevel
          },
          allocations: processedAllocations
      };

      if (editingRule) {
          setConfig(prev => ({
              ...prev,
              rules: prev.rules.map(r => r.id === editingRule.id ? { ...editingRule, ...newRuleData } : r)
          }));
      } else {
          setConfig(prev => ({
              ...prev,
              rules: [...prev.rules, { id: `rule_${Date.now()}`, ...newRuleData }]
          }));
      }
      setIsRuleModalOpen(false);
      ruleForm.resetFields();
      setEditingRule(null);
  };

  const deleteRule = (id: string) => {
      setConfig(prev => ({ ...prev, rules: prev.rules.filter(r => r.id !== id) }));
  };

  const openRuleModal = (rule?: AdTrafficRule) => {
      setEditingRule(rule || null);
      if (rule) {
          // Flatten allocations for form
          const allocMap: Record<string, number> = {};
          rule.allocations.forEach(a => allocMap[a.strategyId] = a.percentage);
          
          ruleForm.setFieldsValue({
              name: rule.name,
              priority: rule.priority,
              channels: rule.conditions.channels,
              countries: rule.conditions.countries,
              userLevel: rule.conditions.userLevel,
              allocations: allocMap
          });
      } else {
          ruleForm.resetFields();
          // Default Allocations to empty or first strategy
          if (config.strategies.length > 0) {
              ruleForm.setFieldsValue({
                  channels: [],
                  countries: [],
                  priority: 10,
                  allocations: { [config.strategies[0].id]: 100 }
              });
          }
      }
      setIsRuleModalOpen(true);
  };

  const toggleRule = (id: string, enabled: boolean) => {
      setConfig(prev => ({
          ...prev,
          rules: prev.rules.map(r => r.id === id ? { ...r, enabled } : r)
      }));
  };

  // --- Render Helpers ---
  const getStrategyName = (id: string) => config.strategies.find(s => s.id === id)?.name || '未知策略';

  return (
    // Fix: replaced 'className' with 'class' for environment compliance
    <div class="space-y-8 animate-fade-in pb-12">
      <div class="flex items-center gap-2 mb-2">
        {/* Fix: Changed text color to text-blue-700 for better visibility */}
        <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 uppercase tracking-wide">
          广告分发配置: {selectedApp.name}
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: TRAFFIC RULES (Main Logic) */}
        <div class="lg:col-span-2 space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Layers size={20} class="text-indigo-600"/> 流量分发规则
                    </h2>
                    <p class="text-slate-500 text-sm">定义用户特征（渠道、国家、层级），分配对应广告策略。</p>
                </div>
                <Button icon={<Plus size={16}/>} onClick={() => openRuleModal()}>新建规则</Button>
            </div>

            <div class="space-y-4">
                {config.rules.sort((a,b) => a.priority - b.priority).map((rule) => (
                    <div key={rule.id} class={`bg-white rounded-xl p-5 border border-slate-200 shadow-sm transition-all hover:border-indigo-300 relative group ${!rule.enabled ? 'opacity-60 grayscale' : ''}`}>
                         {/* Header */}
                         <div class="flex justify-between items-start mb-4">
                            <div class="flex gap-3 items-center">
                                <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                    P{rule.priority}
                                </div>
                                <div>
                                    <h3 class="font-bold text-slate-800 text-base">{rule.name}</h3>
                                    <div class="flex gap-2 mt-1">
                                        {rule.conditions.channels.map(c => <Tag key={c} color="blue" class="mr-0 text-[10px]">{c}</Tag>)}
                                        {rule.conditions.countries.map(c => <Tag key={c} color="cyan" class="mr-0 text-[10px]">{c}</Tag>)}
                                        <Tag color="purple" class="mr-0 text-[10px]">{rule.conditions.userLevel}</Tag>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <Switch checked={rule.enabled} onChange={(v) => toggleRule(rule.id, v)} />
                                <Button size="small" variant="ghost" icon={<Settings size={14}/>} onClick={() => openRuleModal(rule)}/>
                            </div>
                         </div>

                         {/* Distribution Bar */}
                         <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                             <div class="flex justify-between text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">
                                <span>策略分发占比</span>
                                <span class="flex items-center gap-1"><PieChart size={12}/> Total 100%</span>
                             </div>
                             <div class="flex h-3 w-full rounded-full overflow-hidden bg-slate-200">
                                 {rule.allocations.map((alloc, idx) => {
                                     // Generate colors
                                     const colors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
                                     const color = colors[idx % colors.length];
                                     return (
                                         <Tooltip key={alloc.strategyId} title={`${getStrategyName(alloc.strategyId)}: ${alloc.percentage}%`}>
                                            <div style={{ width: `${alloc.percentage}%` }} class={`h-full ${color} hover:opacity-80 transition-opacity`}/>
                                         </Tooltip>
                                     )
                                 })}
                             </div>
                             <div class="mt-2 space-y-1">
                                 {rule.allocations.map((alloc, idx) => (
                                     <div key={alloc.strategyId} class="flex justify-between text-xs items-center">
                                         <span class="flex items-center gap-2">
                                            <div class={`w-2 h-2 rounded-full ${['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'][idx % 4]}`}></div>
                                            <span class="text-slate-700">{getStrategyName(alloc.strategyId)}</span>
                                         </span>
                                         <span class="font-mono font-bold text-slate-600">{alloc.percentage}%</span>
                                     </div>
                                 ))}
                             </div>
                         </div>
                    </div>
                ))}
            </div>
        </div>

        {/* RIGHT COLUMN: STRATEGY LIBRARY (Definitions) */}
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Settings size={20} class="text-emerald-600"/> 策略库
                    </h2>
                    <p class="text-slate-500 text-sm">定义具体的广告聚合与Provider。</p>
                </div>
                <Button size="small" variant="secondary" icon={<Plus size={14}/>} onClick={() => openStratModal()}>添加</Button>
            </div>

            <div class="grid grid-cols-1 gap-4">
                {config.strategies.map(strat => (
                    <div key={strat.id} class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative">
                         <div class="flex items-start justify-between">
                             <div class="flex gap-3">
                                 <div class="p-2 bg-emerald-50 text-emerald-600 rounded-lg h-fit">
                                     <BarChart size={18} />
                                 </div>
                                 <div>
                                     <div class="font-bold text-slate-800 text-sm">{strat.name}</div>
                                     <div class="text-xs text-slate-500 mt-1 flex flex-wrap gap-1">
                                         <Badge color="blue">{strat.provider}</Badge>
                                         <span class="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{strat.aggregationType}</span>
                                     </div>
                                 </div>
                             </div>
                             <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="small" variant="ghost" icon={<Settings size={14}/>} onClick={() => openStratModal(strat)}/>
                                <Button size="small" variant="ghost" class="text-red-500 hover:text-red-600" icon={<Trash2 size={14}/>} onClick={() => deleteStrategy(strat.id)}/>
                             </div>
                         </div>
                    </div>
                ))}
            </div>

            <div class="bg-amber-50 border border-amber-100 p-4 rounded-xl text-xs text-amber-800 leading-relaxed">
                 <div class="flex items-center gap-2 font-bold mb-1"><AlertCircle size={14}/> 说明</div>
                 策略库仅定义"怎么展示广告"（如使用TopOn单聚合）。具体的"给谁展示"（如MTG用户）请在左侧规则中配置。
            </div>
        </div>

      </div>

      {/* --- MODAL: STRATEGY --- */}
      <Modal
        title={editingStrat ? "编辑广告策略" : "新建广告策略"}
        open={isStratModalOpen}
        onOk={form.submit}
        onCancel={() => setIsStratModalOpen(false)}
      >
          <Form form={form} layout="vertical" onFinish={handleSaveStrategy}>
              <Form.Item name="name" label="策略名称" rules={[{ required: true }]}>
                  <AntInput placeholder="例如: TopOn 美国瀑布流" />
              </Form.Item>
              <Form.Item name="provider" label="广告 Provider" rules={[{ required: true }]}>
                  <AntSelect>
                      {PRESET_PROVIDERS.map(p => <Option key={p} value={p}>{p}</Option>)}
                  </AntSelect>
              </Form.Item>
              <Form.Item name="aggregationType" label="聚合方式" rules={[{ required: true }]}>
                  <AntSelect>
                      <Option value={AdAggregationType.SINGLE}>{AdAggregationType.SINGLE}</Option>
                      <Option value={AdAggregationType.WATERFALL}>{AdAggregationType.WATERFALL}</Option>
                      <Option value={AdAggregationType.BIDDING}>{AdAggregationType.BIDDING}</Option>
                  </AntSelect>
              </Form.Item>
          </Form>
      </Modal>

      {/* --- MODAL: RULE --- */}
      <Modal
        title={editingRule ? "编辑流量分发规则" : "新建流量分发规则"}
        open={isRuleModalOpen}
        onOk={ruleForm.submit}
        onCancel={() => setIsRuleModalOpen(false)}
        width={600}
      >
          <Form form={ruleForm} layout="vertical" onFinish={handleSaveRule}>
              <div class="grid grid-cols-4 gap-4">
                <Form.Item name="name" label="规则名称" class="col-span-3" rules={[{ required: true }]}>
                    <AntInput placeholder="例如: MTG 新用户" />
                </Form.Item>
                <Form.Item name="priority" label="优先级" class="col-span-1" help="小号优先">
                    <AntInput type="number" />
                </Form.Item>
              </div>

              <div class="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-100">
                  <h4 class="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-1"><Users size={12}/> 定向条件</h4>
                  <Form.Item name="channels" label="买量渠道 (Channel)" rules={[{ required: true, message: '请选择至少一个渠道' }]}>
                      <AntSelect mode="multiple" placeholder="选择渠道源" allowClear>
                          {PRESET_CHANNELS.map(c => <Option key={c} value={c}>{c}</Option>)}
                      </AntSelect>
                  </Form.Item>
                  <div class="grid grid-cols-2 gap-4">
                    <Form.Item name="countries" label="国家/地区" rules={[{ required: true }]}>
                        <AntSelect mode="tags" placeholder="输入国家代码, 如 US" tokenSeparators={[',', ' ']} />
                    </Form.Item>
                    <Form.Item name="userLevel" label="用户层级" rules={[{ required: true }]}>
                        <AntSelect>
                            {PRESET_USER_LEVELS.map(l => <Option key={l} value={l}>{l}</Option>)}
                        </AntSelect>
                    </Form.Item>
                  </div>
              </div>

              <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <h4 class="text-xs font-bold text-indigo-800 uppercase mb-3 flex items-center gap-1"><PieChart size={12}/> 流量分配 (总和需为 100%)</h4>
                  
                  {config.strategies.length === 0 && <div class="text-red-500 text-xs">请先新建策略库</div>}

                  {config.strategies.map(strat => (
                      <Form.Item 
                        key={strat.id} 
                        name={['allocations', strat.id]} 
                        label={<span class="text-xs font-medium text-slate-600">{strat.name} <span class="opacity-50">({strat.provider})</span></span>}
                        class="mb-2"
                        initialValue={0}
                      >
                          <div class="flex items-center gap-4">
                              <Slider class="flex-1" min={0} max={100} tooltip={{ formatter: (v) => `${v}%` }} />
                              <div class="w-16">
                                <AntInput suffix="%" size="small" />
                              </div>
                          </div>
                      </Form.Item>
                  ))}
              </div>
          </Form>
      </Modal>
    </div>
  );
};
