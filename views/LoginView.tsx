import React, { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { ArrowRightLeft, Globe, Bell, QrCode, Monitor, ScanLine } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isQrMode, setIsQrMode] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[640px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative flex flex-col min-h-[560px] transition-all duration-300">
        
        {/* Login Method Switcher (Top Right) */}
        <div 
          className="absolute top-0 right-0 z-20 cursor-pointer group" 
          onClick={() => setIsQrMode(!isQrMode)}
        >
             {/* Visual Triangle/Corner Background */}
            <div className="w-0 h-0 border-t-[60px] border-r-[60px] border-t-transparent border-r-indigo-50/80 absolute top-0 right-0"></div>
            
            {/* Toggle Icon */}
            <div className="absolute top-3 right-3 p-1 rounded-bl-2xl rounded-tr-lg hover:scale-105 transition-transform">
               {isQrMode ? (
                 <Monitor className="text-indigo-600 w-6 h-6" />
               ) : (
                 <QrCode className="text-indigo-600 w-6 h-6" />
               )}
            </div>

            {/* Tooltip Bubble */}
            <div className="absolute right-[60px] top-6 -translate-y-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                {isQrMode ? '账号密码登录' : '扫码登录'}
                <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-slate-800"></div>
            </div>
        </div>

        {isQrMode ? (
            // --- QR Code View ---
            <div className="flex-1 flex flex-col items-center justify-center p-12 animate-fade-in text-center">
                 <h2 className="text-2xl font-bold text-slate-800 mb-2">飞书扫码登录</h2>
                 <p className="text-slate-500 text-sm mb-10">安全 · 便捷 · 高效</p>

                 <div 
                    className="w-56 h-56 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center mb-8 shadow-inner relative group cursor-pointer overflow-hidden transition-all hover:border-indigo-200"
                    onClick={onLogin}
                 >
                    {/* Simulated QR Code SVG */}
                     <svg viewBox="0 0 100 100" className="w-48 h-48 text-slate-800" fill="currentColor">
                        <path d="M10 10h20v20h-20zM40 10h20v10h-20zM70 10h20v20h-20zM20 40h10v10h-10zM50 40h20v10h-20zM80 40h10v20h-10zM10 70h20v20h-20zM40 70h10v10h-10zM70 70h20v20h-20zM15 15v10h10v-10zM75 15v10h10v-10zM15 75v10h10v-10zM35 10h5v5h-5zM65 30h5v5h-5zM40 50h10v10h-10zM60 80h10v10h-10z" />
                        <rect x="35" y="35" width="30" height="30" fillOpacity="0.05" />
                        <path d="M12 12h16v16h-16z" fillOpacity="0.1"/>
                        <path d="M72 12h16v16h-16z" fillOpacity="0.1"/>
                        <path d="M12 72h16v16h-16z" fillOpacity="0.1"/>
                     </svg>
                    
                    {/* Center Logo Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white p-1.5 rounded-lg shadow-sm">
                           <svg viewBox="0 0 24 24" className="w-6 h-6 text-cyan-500" fill="currentColor">
                             <path d="M21.03 5.47c-1.37-.55-2.85-.93-4.4-1.07a11.37 11.37 0 00-1.87-.16c-1.74 0-3.38.34-4.9.96-.54.22-1.06.48-1.56.77l-.02.01c-.04.03-.09.05-.13.08-.12.08-.25.16-.37.24l-.07.05c-.65.45-1.25.96-1.79 1.52-.94.97-1.7 2.1-2.24 3.34-.05.11-.09.23-.13.34-.02.05-.04.11-.06.16-.2.53-.36 1.08-.48 1.64a.8.8 0 00.32.84c.36.23.73.44 1.11.64.47.24.95.46 1.44.66.12.05.23.09.35.14.07.03.15.06.22.09.81.31 1.66.56 2.53.74.15.03.3.06.45.09.37.07.74.12 1.12.16.14 0 .28.01.42.01 1.74 0 3.38-.34 4.9-.96.54-.22 1.06-.48 1.56-.77l.02-.01c.04-.03.09-.05.13-.08.12-.08.25-.16.37-.24l.07-.05c.65-.45 1.25-.96 1.79-1.52.94-.97 1.7-2.1 2.24-3.34.05-.11.09-.23.13-.34.02-.05.04-.11.06-.16.2-.53.36-1.08.48-1.64a.8.8 0 00-.32-.84c-.36-.23-.73-.44-1.11-.64-.47-.24-.95-.46-1.44-.66-.12-.05-.23-.09-.35-.14-.07-.03-.15-.06-.22-.09a11.32 11.32 0 00-2.53-.74z" />
                           </svg>
                        </div>
                    </div>

                    {/* Hover Interaction Overlay */}
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100">
                         <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                            <ScanLine className="text-indigo-600 w-6 h-6" />
                         </div>
                         <span className="text-sm font-bold text-slate-800">模拟扫码成功</span>
                         <span className="text-xs text-slate-400 mt-1">点击即可自动跳转</span>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <p className="text-sm text-slate-600 font-medium">请使用 飞书客户端 扫一扫</p>
                    <p className="text-xs text-slate-400">OpsCore 中台通用登录</p>
                 </div>
            </div>
        ) : (
            // --- Account Auth View (Existing) ---
            <>
                <div className="p-12 pb-8 flex flex-col items-center flex-1 animate-fade-in">
                    
                    {/* Logo Exchange Area */}
                    <div className="flex items-center gap-8 mb-8">
                        {/* OpsCore Logo */}
                        <div className="w-16 h-16 bg-[#1677ff] rounded-2xl flex items-center justify-center shadow-md">
                           <Bell className="text-white w-8 h-8" fill="currentColor" />
                        </div>

                        <ArrowRightLeft className="text-slate-300 w-6 h-6" />

                        {/* Feishu Logo */}
                        <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-md relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-10"></div>
                           <svg viewBox="0 0 24 24" className="w-10 h-10 text-cyan-500" fill="currentColor">
                             <path d="M21.03 5.47c-1.37-.55-2.85-.93-4.4-1.07a11.37 11.37 0 00-1.87-.16c-1.74 0-3.38.34-4.9.96-.54.22-1.06.48-1.56.77l-.02.01c-.04.03-.09.05-.13.08-.12.08-.25.16-.37.24l-.07.05c-.65.45-1.25.96-1.79 1.52-.94.97-1.7 2.1-2.24 3.34-.05.11-.09.23-.13.34-.02.05-.04.11-.06.16-.2.53-.36 1.08-.48 1.64a.8.8 0 00.32.84c.36.23.73.44 1.11.64.47.24.95.46 1.44.66.12.05.23.09.35.14.07.03.15.06.22.09.81.31 1.66.56 2.53.74.15.03.3.06.45.09.37.07.74.12 1.12.16.14 0 .28.01.42.01 1.74 0 3.38-.34 4.9-.96.54-.22 1.06-.48 1.56-.77l.02-.01c.04-.03.09-.05.13-.08.12-.08.25-.16.37-.24l.07-.05c.65-.45 1.25-.96 1.79-1.52.94-.97 1.7-2.1 2.24-3.34.05-.11.09-.23.13-.34.02-.05.04-.11.06-.16.2-.53.36-1.08.48-1.64a.8.8 0 00-.32-.84c-.36-.23-.73-.44-1.11-.64-.47-.24-.95-.46-1.44-.66-.12-.05-.23-.09-.35-.14-.07-.03-.15-.06-.22-.09a11.32 11.32 0 00-2.53-.74z" />
                           </svg>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-slate-800 mb-8 text-center">
                        OpsCore 中台 请求登录你的 飞书 账号
                    </h2>

                    <div className="w-full space-y-2 mb-6 text-slate-500 text-sm font-medium">
                        <p>你将使用以下账号授权登录</p>
                    </div>

                    {/* User Account Card */}
                    <div className="w-full bg-slate-50 rounded-lg p-4 flex items-center justify-between mb-8 group border border-transparent hover:border-slate-200 transition-colors">
                        <div className="flex items-center gap-4">
                           {/* Company Logo Placeholder */}
                           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100 overflow-hidden p-1.5">
                              <svg viewBox="0 0 24 24" className="w-full h-full text-blue-500" fill="currentColor">
                                  <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
                              </svg>
                           </div>
                           <div>
                              <div className="font-bold text-slate-800 text-sm">成都中云天下科技有限公司</div>
                              <div className="text-slate-500 text-xs mt-0.5">Admin User</div>
                           </div>
                        </div>
                        <button className="text-blue-600 text-sm font-medium hover:underline">
                          使用其他账号
                        </button>
                    </div>

                    {/* Permissions Area */}
                    <div className="w-full space-y-4 mb-8">
                         <p className="text-slate-500 text-sm">授权后，应用将获得以下权限：</p>
                         <ul className="space-y-3">
                           <li className="flex items-start gap-2 text-sm text-slate-700">
                              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                              <span>获取你的个人信息（姓名、头像）</span>
                           </li>
                         </ul>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 md:px-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-white mt-auto w-full">
                   <div className="flex items-center gap-2 text-slate-500 text-sm cursor-pointer hover:text-slate-700">
                      <Globe size={16} />
                      <span>简体中文</span>
                      <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                   </div>

                   <div className="flex items-center gap-4 w-full md:w-auto">
                      <Button size="large" className="w-full md:w-32 rounded-lg" onClick={() => {}}>
                        拒绝
                      </Button>
                      <Button type="primary" size="large" className="w-full md:w-32 rounded-lg bg-blue-600 hover:bg-blue-500" onClick={onLogin}>
                        授权
                      </Button>
                   </div>
                </div>
            </>
        )}

      </div>
    </div>
  );
};