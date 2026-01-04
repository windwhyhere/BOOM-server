import React, { useState } from 'react';
import { RiskConfig, AppProfile, ShuMengLog } from '../types';
import { Card, Switch, Badge, TextArea, Button } from '../components/UI';
import { ShieldAlert, ShieldCheck, Smartphone, Eye, Activity, Search, Database, Calendar } from 'lucide-react';
import { Table, Tag, Statistic, Switch as AntSwitch, DatePicker } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface RiskViewProps {
  selectedApp: AppProfile;
}

const MOCK_LOGS: ShuMengLog[] = [
    { id: '102938', user_id: 'u_29102', device_id: 'd_88291a', platform: 'Android', event_code: 'register', risk_level: 'HIGH', risk_tags: 'emulator,root', raw_response: '{"score": 98, "device_detail": "virtual_box"}', created_at: '2023-11-15 10:23:41' },
    { id: '102939', user_id: 'u_55123', device_id: 'd_77123b', platform: 'iOS', event_code: 'login', risk_level: 'MEDIUM', risk_tags: 'vpn', raw_response: '{"score": 65, "ip_risk": true}', created_at: '2023-11-15 10:25:12' },
    { id: '102940', user_id: 'u_11234', device_id: 'd_99123c', platform: 'Android', event_code: 'withdraw', risk_level: 'HIGH', risk_tags: 'auto_clicker', raw_response: '{"score": 95, "touch_pattern": "machine"}', created_at: '2023-11-15 10:45:00' },
    { id: '102941', user_id: 'u_88122', device_id: 'd_11234d', platform: 'Android', event_code: 'ad_impression', risk_level: 'LOW', risk_tags: 'normal', raw_response: '{"score": 10}', created_at: '2023-11-15 11:02:30' },
    { id: '102942', user_id: 'u_99111', device_id: 'd_22334e', platform: 'iOS', event_code: 'register', risk_level: 'HIGH', risk_tags: 'device_farm', raw_response: '{"score": 99, "similar_devices": 50}', created_at: '2023-11-15 11:15:20' },
];

export const RiskView: React.FC<RiskViewProps> = ({ selectedApp }) => {
  const [showLogs, setShowLogs] = useState(false);
  const [statsDate, setStatsDate] = useState<dayjs.Dayjs>(dayjs());
  
  const [config, setConfig] = useState<RiskConfig>(() => {
    // App 1 (default) is strict, App 2 is loose
    if (selectedApp.id === 'app_2') {
        return {
            cloak: {
                enabled: false,
                versions: ''
            },
            shumeng: {
                sdkEnabled: true,
                serverEnabled: false,
            },
            deviceChecks: {
                vpn: true,
                sim: false,
                ip: true,
                googlePlayInstall: false,
                emulator: false,
                root: false,
                devMode: false,
            },
            attribution: { 
                mmpEnabled: false,
                referrerEnabled: false,
                referrerParams: ''
            }
        };
    }

    return {
        cloak: {
            enabled: true,
            versions: '1.0.5, 1.1.0'
        },
        shumeng: {
            sdkEnabled: true,
            serverEnabled: true,
        },
        deviceChecks: {
        vpn: true,
        sim: true,
        ip: true,
        googlePlayInstall: true,
        emulator: true,
        root: true,
        devMode: false,
        },
        attribution: {
          mmpEnabled: true,
          referrerEnabled: true,
          referrerParams: 'utm_source=(not set), utm_medium=organic, organic'
        }
    };
  });

  const toggleDeviceCheck = (key: keyof RiskConfig['deviceChecks']) => {
    setConfig(prev => ({
      ...prev,
      deviceChecks: { ...prev.deviceChecks, [key]: !prev.deviceChecks[key] }
    }));
  };

  const checkItems: { key: keyof RiskConfig['deviceChecks']; label: string }[] = [
    { key: 'vpn', label: 'VPN 检测' },
    { key: 'sim', label: 'SIM 卡检测' },
    { key: 'ip', label: 'IP 黑名单' },
    { key: 'emulator', label: '模拟器检测' },
    { key: 'root', label: 'Root/越狱检测' },
    { key: 'devMode', label: '开发者模式' },
    { key: 'googlePlayInstall', label: 'Google Play 来源检测' },
  ];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80, render: (text: string) => <span className="text-xs font-mono">{text}</span> },
    { title: 'User ID', dataIndex: 'user_id', key: 'user_id', render: (text: string) => <span className="text-xs text-blue-600">{text}</span> },
    { title: 'Device ID', dataIndex: 'device_id', key: 'device_id', ellipsis: true, render: (text: string) => <span className="text-xs text-slate-500">{text}</span> },
    { title: 'Platform', dataIndex: 'platform', key: 'platform', width: 80 },
    { title: 'Event', dataIndex: 'event_code', key: 'event_code' },
    { 
        title: 'Level', 
        dataIndex: 'risk_level', 
        key: 'risk_level',
        render: (level: string) => {
            let color = 'green';
            if (level === 'HIGH') color = 'red';
            if (level === 'MEDIUM') color = 'orange';
            return <Tag color={color}>{level}</Tag>;
        }
    },
    { 
        title: 'Tags', 
        dataIndex: 'risk_tags', 
        key: 'risk_tags',
        render: (tags: string) => (
            <>
                {tags.split(',').map(tag => (
                    <Tag key={tag} className="mr-1 text-[10px]">{tag}</Tag>
                ))}
            </>
        )
    },
    { title: 'Time', dataIndex: 'created_at', key: 'created_at', width: 150, render: (text: string) => <span className="text-xs text-slate-400">{text}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
         <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100 uppercase tracking-wide">
           安全概览: {selectedApp.name}
         </span>
      </div>

      {/* High Level Switches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Cloak Card */}
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none shadow-indigo-500/20">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <ShieldAlert className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Cloak 屏蔽系统</h3>
                <p className="text-indigo-100/70 text-xs mt-1">仅对指定版本生效 (Version Control)</p>
              </div>
            </div>
            
          </div>

          {/* Version Control Section */}
          <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-indigo-50">启用版本拦截</span>
                  <AntSwitch 
                        checked={config.cloak.enabled}
                        onChange={(v) => setConfig({...config, cloak: {...config.cloak, enabled: v}})}
                        className="bg-indigo-700/50"
                  />
              </div>
              
              <div className={`transition-all duration-300 ${config.cloak.enabled ? 'opacity-100 h-auto' : 'opacity-50 h-auto grayscale'}`}>
                 <input
                   disabled={!config.cloak.enabled}
                   value={config.cloak.versions}
                   onChange={(e) => setConfig({...config, cloak: {...config.cloak, versions: e.target.value}})}
                   className="w-full bg-white/10 border border-indigo-400/30 rounded-lg px-3 py-2 text-sm text-white placeholder-indigo-300/50 focus:outline-none focus:bg-white/20 focus:border-indigo-300/50 transition-all font-mono"
                   placeholder="输入版本号 (如 1.0.0, 1.2.0)"
                 />
                 <p className="text-[10px] text-indigo-200 mt-2 opacity-80 flex items-center gap-1">
                    <ShieldCheck size={10} />
                    Cloak 策略将仅应用于上述版本列表。
                 </p>
              </div>
          </div>
        </Card>

        {/* ShuMeng Card */}
        <Card className="bg-white">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">ShuMeng (数盟)</h3>
                <p className="text-slate-500 text-sm">第三方风控数据</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">SDK 采集开关</span>
                  <Switch 
                    checked={config.shumeng.sdkEnabled}
                    onChange={(v) => setConfig({...config, shumeng: {...config.shumeng, sdkEnabled: v}})}
                  />
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">服务端拦截开关</span>
                  <Switch 
                    checked={config.shumeng.serverEnabled}
                    onChange={(v) => setConfig({...config, shumeng: {...config.shumeng, serverEnabled: v}})}
                  />
              </div>
              
              <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                       <span className="text-xs text-slate-500 font-medium">拦截数据概览</span>
                       <DatePicker 
                          size="small" 
                          value={statsDate} 
                          onChange={(date) => setStatsDate(date || dayjs())}
                          style={{ width: 110 }}
                          allowClear={false}
                       />
                  </div>
                  <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                          <Statistic 
                            title="受影响用户数" 
                            value={128} 
                            valueStyle={{fontSize: 20, fontWeight: 700, color: '#0f172a'}} 
                            prefix={<ShieldCheck size={18} className="text-red-500 inline mr-1" />} 
                          />
                      </div>
                      <Button 
                        size="small" 
                        variant={showLogs ? 'primary' : 'secondary'} 
                        onClick={() => setShowLogs(!showLogs)}
                        icon={<Database size={14} />}
                      >
                        {showLogs ? '隐藏日志' : '查询日志'}
                      </Button>
                  </div>
              </div>
          </div>
        </Card>
      </div>
      
      {/* Logs Table Section (Conditional) */}
      {showLogs && (
        <div className="animate-fade-in">
           <Card 
             title="服务端拦截日志查询" 
             action={
               <div className="flex gap-2">
                   <RangePicker size="small" style={{ width: 240 }} />
                   <Button size="small" icon={<Search size={14} />}>搜索</Button>
               </div>
             }
           >
               <Table 
                 dataSource={MOCK_LOGS} 
                 columns={columns} 
                 size="small" 
                 pagination={{ pageSize: 5 }}
                 expandable={{
                    expandedRowRender: (record) => (
                        <div className="p-2 bg-slate-50 rounded font-mono text-xs text-slate-600">
                            <strong>Raw Response:</strong> {record.raw_response}
                        </div>
                    ),
                 }}
               />
           </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Device Fingerprinting */}
        <div className="md:col-span-2">
          <Card title="设备环境检测" action={<Smartphone size={18} className="text-slate-400"/>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {checkItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  <Switch 
                    checked={config.deviceChecks[item.key]}
                    onChange={() => toggleDeviceCheck(item.key)}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Attribution / Organic */}
        <div>
          <Card title="归因与自然量" action={<Eye size={18} className="text-slate-400"/>}>
            <div className="space-y-5">
               <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-700 leading-relaxed">
                  识别自然用户并应用严格广告策略。支持 MMP 归因回调或 Play Store Referrer 参数匹配。
               </div>

               {/* MMP */}
               <div className="flex items-center justify-between py-1">
                  <div>
                      <div className="font-medium text-slate-700 text-sm">MMP 归因</div>
                      <div className="text-xs text-slate-400">AppsFlyer / Adjust</div>
                  </div>
                  <Switch 
                    checked={config.attribution.mmpEnabled} 
                    onChange={(v) => setConfig({...config, attribution: {...config.attribution, mmpEnabled: v}})}
                  />
               </div>
               
               <div className="border-t border-slate-100 my-1"></div>

               {/* Referrer */}
               <div className="space-y-3">
                  <div className="flex items-center justify-between">
                       <div>
                          <div className="font-medium text-slate-700 text-sm">Referrer 识别</div>
                          <div className="text-xs text-slate-400">Google Play Install Referrer</div>
                      </div>
                      <Switch 
                          checked={config.attribution.referrerEnabled} 
                          onChange={(v) => setConfig({...config, attribution: {...config.attribution, referrerEnabled: v}})}
                      />
                  </div>
                  
                  {config.attribution.referrerEnabled && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 animate-fade-in">
                          <TextArea 
                              label="屏蔽参数 (多个用逗号分隔)"
                              placeholder="例如: utm_source=organic, utm_medium=(none)"
                              rows={4}
                              value={config.attribution.referrerParams}
                              onChange={(e) => setConfig({...config, attribution: {...config.attribution, referrerParams: e.target.value}})}
                              className="text-xs font-mono"
                          />
                      </div>
                  )}
               </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};