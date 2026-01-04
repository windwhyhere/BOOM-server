import React, { useState } from 'react';
import { ViewState, AppProfile } from './types';
import { AdsView } from './views/AdsView';
import { NotifyView } from './views/NotifyView';
import { RiskView } from './views/RiskView';
import { EconomyView } from './views/EconomyView';
import { LoginView } from './views/LoginView';
import { LayoutGrid, Bell, Shield, Coins, LogOut, Gamepad2, Home, Plus, Smartphone, AppWindow, Apple } from 'lucide-react';
import { Layout, Menu, Avatar, Select, Typography, ConfigProvider, theme, Space, Breadcrumb, Divider, Button, Modal, Form, Input, Radio, Dropdown } from 'antd';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const MOCK_APPS: AppProfile[] = [
  { id: 'app_1', name: 'Puzzle Master 3D', package: 'com.game.puzzle.master', platform: 'Google' },
  { id: 'app_2', name: 'Speed Racer Pro', package: 'com.racing.speed.pro', platform: 'Apple' },
  { id: 'app_3', name: 'Daily Utility Tool', package: 'com.util.daily.tool', platform: 'Google' },
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.ADS);
  const [apps, setApps] = useState<AppProfile[]>(MOCK_APPS);
  const [selectedApp, setSelectedApp] = useState<AppProfile>(MOCK_APPS[0]);
  const [collapsed, setCollapsed] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // If not logged in, show Login View
  if (!isLoggedIn) {
      return (
        <ConfigProvider
            theme={{
                token: {
                colorPrimary: '#1677ff',
                fontFamily: "'Inter', sans-serif",
                },
            }}
        >
            <LoginView onLogin={() => setIsLoggedIn(true)} />
        </ConfigProvider>
      );
  }

  const handleAddApp = (values: any) => {
    const newApp: AppProfile = {
      id: `app_${Date.now()}`,
      name: values.name,
      package: values.package,
      platform: values.platform
    };
    
    setApps([...apps, newApp]);
    setSelectedApp(newApp);
    setIsModalOpen(false);
    form.resetFields();
  };

  const menuItems = [
    {
      key: ViewState.ADS,
      icon: <LayoutGrid size={18} />,
      label: '广告配置',
    },
    {
      key: ViewState.NOTIFICATIONS,
      icon: <Bell size={18} />,
      label: '消息通知',
    },
    {
      key: ViewState.RISK,
      icon: <Shield size={18} />,
      label: '风控管理',
    },
    {
      key: ViewState.ECONOMY,
      icon: <Coins size={18} />,
      label: '网赚数值',
    },
  ];

  const getViewTitle = () => {
      switch(currentView) {
          case ViewState.ADS: return '广告策略配置';
          case ViewState.NOTIFICATIONS: return '消息通知中心';
          case ViewState.RISK: return '风控管理系统';
          case ViewState.ECONOMY: return '网赚数值配置';
          default: return '配置';
      }
  }

  const userMenu = {
      items: [
          {
              key: 'logout',
              label: '退出登录',
              icon: <LogOut size={14}/>,
              danger: true,
              onClick: () => setIsLoggedIn(false)
          }
      ]
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
          fontFamily: "'Inter', sans-serif",
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ height: '100vh', overflow: 'hidden' }}>
        <Sider 
          collapsible 
          collapsed={collapsed} 
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
          style={{ borderRight: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', zIndex: 10, overflowY: 'auto' }}
          width={240}
        >
          <div className="flex items-center gap-3 p-4 mb-2">
             <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-sm">
               O
             </div>
             {!collapsed && <span className="text-lg font-bold tracking-tight text-slate-800">OpsCore</span>}
          </div>

          <Menu 
            mode="inline" 
            selectedKeys={[currentView]} 
            items={menuItems} 
            onClick={(e) => setCurrentView(e.key as ViewState)}
            style={{ borderRight: 0 }}
          />

          {!collapsed && (
            <div className="absolute bottom-6 left-0 w-full px-4">
               <div 
                 className="border-t border-slate-100 pt-4 cursor-pointer text-slate-500 hover:text-red-500 transition-colors flex items-center gap-3 px-2"
                 onClick={() => setIsLoggedIn(false)}
               >
                 <LogOut size={16} />
                 <span className="text-sm font-medium">退出登录</span>
               </div>
            </div>
          )}
        </Sider>

        <Layout style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', height: 64, flexShrink: 0 }}>
             <div className="flex items-center gap-6 min-w-0">
                {/* App Selector */}
                <Space size={12} className="min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm shrink-0">
                      <Gamepad2 size={20} />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                        <Text type="secondary" style={{ fontSize: 10, lineHeight: 1.2, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>当前应用</Text>
                        <Select
                            value={selectedApp.id}
                            onChange={(value) => setSelectedApp(apps.find(app => app.id === value)!)}
                            options={apps.map(app => ({ 
                                label: (
                                  <div className="flex items-center justify-between w-full gap-2">
                                    <span className="truncate">{app.name}</span>
                                    {app.platform === 'Apple' 
                                      ? <Apple size={14} className="text-slate-400 shrink-0" />
                                      : <Smartphone size={14} className="text-slate-400 shrink-0" />
                                    }
                                  </div>
                                ), 
                                value: app.id 
                            }))}
                            variant="borderless"
                            style={{ width: 200, marginLeft: -11, fontWeight: 700, fontSize: 15 }}
                            suffixIcon={<Plus size={14} className="opacity-50"/>}
                            dropdownRender={(menu) => (
                                <>
                                  {menu}
                                  <Divider style={{ margin: '8px 0' }} />
                                  <div className="px-1 pb-1">
                                    <Button 
                                      type="dashed" 
                                      block 
                                      icon={<Plus size={14} />} 
                                      onClick={() => setIsModalOpen(true)}
                                    >
                                      添加新应用
                                    </Button>
                                  </div>
                                </>
                            )}
                        />
                    </div>
                </Space>
                
                <div className="h-8 w-px bg-slate-100 hidden md:block mx-2 shrink-0"></div>
                
                <Breadcrumb 
                    className="hidden md:block min-w-0"
                    items={[
                        { title: <><Home size={14} className="inline mr-1 relative -top-[2px] opacity-60"/> 控制台</> },
                        { title: getViewTitle() }
                    ]}
                />
             </div>

             <div className="flex items-center gap-4 shrink-0">
                <Dropdown menu={userMenu} placement="bottomRight">
                    <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 py-1 px-2 rounded-full transition-colors max-w-[150px] sm:max-w-[240px]">
                        <div className="hidden sm:flex flex-col items-end min-w-0 justify-center">
                            <div className="text-sm font-bold text-slate-700 leading-none mb-1 truncate">Admin</div>
                            <div className="text-[10px] text-slate-400 leading-none truncate" title="testbird@opscore.com">testbird@opscore.com</div>
                        </div>
                        <Avatar style={{ backgroundColor: '#1677ff', verticalAlign: 'middle', flexShrink: 0 }} size="large">
                            A
                        </Avatar>
                    </div>
                </Dropdown>
             </div>
          </Header>

          <Content style={{ margin: 0, padding: '24px 24px', overflowY: 'auto', flex: 1 }}>
            <div className="max-w-6xl mx-auto animate-fade-in">
               {currentView === ViewState.ADS && <AdsView key={selectedApp.id} selectedApp={selectedApp} />}
               {currentView === ViewState.NOTIFICATIONS && <NotifyView key={selectedApp.id} selectedApp={selectedApp} />}
               {currentView === ViewState.RISK && <RiskView key={selectedApp.id} selectedApp={selectedApp} />}
               {currentView === ViewState.ECONOMY && <EconomyView key={selectedApp.id} selectedApp={selectedApp} />}
            </div>
            <div className="text-center text-slate-400 text-xs py-6">
                © 2024 OpsCore 内部运营平台 • {selectedApp.package} • {selectedApp.platform}
            </div>
          </Content>
        </Layout>
      </Layout>

      {/* Add App Modal */}
      <Modal
        title={
            <div className="flex items-center gap-2 mb-4">
                <AppWindow className="text-indigo-600" size={20}/>
                <span>接入新应用</span>
            </div>
        }
        open={isModalOpen}
        onOk={form.submit}
        onCancel={() => setIsModalOpen(false)}
        okText="确认接入"
        cancelText="取消"
      >
        <Form
            form={form}
            layout="vertical"
            onFinish={handleAddApp}
            initialValues={{ platform: 'Google' }}
        >
            <Form.Item
                name="name"
                label="应用名称"
                rules={[{ required: true, message: '请输入应用名称' }]}
            >
                <Input placeholder="例如: Puzzle Master 3D" />
            </Form.Item>

            <Form.Item
                name="package"
                label="包名 / Bundle ID"
                rules={[{ required: true, message: '请输入包名' }]}
            >
                <Input placeholder="例如: com.game.puzzle.master" />
            </Form.Item>

            <Form.Item
                name="platform"
                label="发布平台"
                rules={[{ required: true }]}
            >
                <Radio.Group>
                    <Radio value="Google">
                        <div className="flex items-center gap-2">
                             <Smartphone size={16}/> Google Play
                        </div>
                    </Radio>
                    <Radio value="Apple">
                        <div className="flex items-center gap-2">
                             <Apple size={16}/> Apple AppStore
                        </div>
                    </Radio>
                </Radio.Group>
            </Form.Item>
        </Form>
      </Modal>

    </ConfigProvider>
  );
};

export default App;