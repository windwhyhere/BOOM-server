// Enums
export enum AdAggregationType {
  SINGLE = '单聚合 (主流)',
  WATERFALL = '多聚合 Waterfall',
  BIDDING = '多聚合 Bidding'
}

export enum NotifType {
  DATA = 'data',
  NOTICE = 'notice'
}

export enum ViewState {
  ADS = 'ads',
  NOTIFICATIONS = 'notifications',
  RISK = 'risk',
  ECONOMY = 'economy'
}

// Interfaces
export interface AppProfile {
  id: string;
  name: string;
  package: string;
  platform: 'Google' | 'Apple';
}

// --- New Ads Structure ---

export interface AdStrategyDef {
  id: string;
  name: string;
  aggregationType: AdAggregationType;
  provider: string; // TopOn, Max, Admob, TradPlus
}

export interface AdAllocation {
  strategyId: string;
  percentage: number; // 0-100
}

export interface AdTrafficRule {
  id: string;
  name: string;
  priority: number;
  enabled: boolean;
  conditions: {
    channels: string[]; // UA Source: Facebook, MTG, Applovin, Organic
    countries: string[]; // US, CN, etc.
    userLevel: string; // New, ARPU > 5, All
  };
  allocations: AdAllocation[];
}

export interface AdConfig {
  strategies: AdStrategyDef[];
  rules: AdTrafficRule[];
}

// -------------------------

export interface FCMStrategy {
  id: string;
  title: string;
  body: string;
  imageUrl: string;
}

export interface FCMTopic {
  id: string;
  name: string;
  type: NotifType;
  priority: 'high' | 'normal' | 'low';
  intervalMins: number;
  strategies: FCMStrategy[];
}

export interface LocalStrategy {
  id: string;
  title: string;
  body: string;
  imageUrl: string;
}

export interface LocalChannel {
  id: string;
  name: string;
  firstSendDelayMins: number;
  intervalMins: number;
  strategies: LocalStrategy[];
}

export interface MediaStrategy {
  id: string;
  title: string;
  body: string;
  imageUrl: string;
}

export interface MediaChannel {
  id: string;
  name: string;
  firstSendDelayMins: number;
  intervalMins: number;
  strategies: MediaStrategy[];
}

export interface NotificationConfig {
  fcm: {
    enabled: boolean;
    jsonConfig: string;
    topics: FCMTopic[];
  };
  local: {
    enabled: boolean;
    channels: LocalChannel[]; 
  };
  media: {
    enabled: boolean;
    channels: MediaChannel[];
  };
  globalEnabled: boolean;
}

export interface ShuMengLog {
  id: string;
  user_id: string;
  device_id: string;
  platform: string;
  event_code: string;
  risk_level: string;
  risk_tags: string;
  raw_response: string;
  created_at: string;
}

export interface RiskConfig {
  cloak: {
    enabled: boolean; // Controls whether version-based filtering is active
    versions: string; // Target versions
  };
  shumeng: {
    sdkEnabled: boolean;
    serverEnabled: boolean;
  };
  deviceChecks: {
    vpn: boolean;
    sim: boolean;
    ip: boolean;
    googlePlayInstall: boolean;
    emulator: boolean;
    root: boolean;
    devMode: boolean;
  };
  attribution: {
    mmpEnabled: boolean;
    referrerEnabled: boolean;
    referrerParams: string; // Comma separated or multiline
  };
}

export interface EconomyRule {
  id: string;
  minBalance: number; // Start of dollar range
  maxBalance: number; // End of dollar range
  interstitialProb: number; // 0-100%
  rewardedProb: number; // 0-100%
  rhythms: Record<string, number>; // Dynamic rhythm values e.g. { 'quiz': 10, 'wheel': 50 }
}

export interface WithdrawalTask {
  id: string;
  name: string;
  count?: number; // 次数要求
  days?: number; // 天数要求
}

export interface QueueConfig {
  enabled: boolean;
  initialRank: number;
  totalRank: number;
  advancements: number[]; // Array of rank improvements per task
}

export interface EconomyConfig {
  rhythmKeys: string[]; // Definition of available rhythm fields
  rules: EconomyRule[];
  withdrawalTasks: WithdrawalTask[];
  queue: QueueConfig;
}