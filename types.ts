
// View state enumeration for navigation
export enum ViewState {
  ADS = 'ADS',
  NOTIFICATIONS = 'NOTIFICATIONS',
  RISK = 'RISK',
  ECONOMY = 'ECONOMY'
}

export interface AppProfile {
  id: string;
  name: string;
  package: string;
  platform: 'Google' | 'Apple';
}

// --- Strategy Pool (Used by legacy or shared components) ---
export interface StrategyItem {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
}

export interface StrategyChannel {
  id: string;
  name: string;
  strategies: StrategyItem[];
}

// --- Ads Management Types ---
export enum AdAggregationType {
  SINGLE = 'SINGLE',
  WATERFALL = 'WATERFALL',
  BIDDING = 'BIDDING'
}

export interface AdStrategyDef {
  id: string;
  name: string;
  aggregationType: AdAggregationType;
  provider: string;
}

export interface AdTrafficRule {
  id: string;
  name: string;
  priority: number;
  enabled: boolean;
  conditions: {
    channels: string[];
    countries: string[];
    userLevel: string;
  };
  allocations: {
    strategyId: string;
    percentage: number;
  }[];
}

export interface AdConfig {
  strategies: AdStrategyDef[];
  rules: AdTrafficRule[];
}

// --- Notifications Management Types ---
export enum NotifType {
  DATA = 'data',
  NOTICE = 'notice'
}

export interface FCMStrategy {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
}

export interface FCMTopic {
  id: string;
  name: string;
  type: NotifType;
  priority: string;
  intervalMins: number;
  strategies: FCMStrategy[];
}

export interface LocalStrategy {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
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
  imageUrl?: string;
}

export interface MediaChannel {
  id: string;
  name: string;
  firstSendDelayMins: number;
  intervalMins: number;
  strategies: MediaStrategy[];
}

export interface NotificationConfig {
  globalEnabled: boolean;
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
}

// --- Risk Management Types ---
export interface RiskConfig {
  cloak: {
    enabled: boolean;
    versions: string;
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
    referrerParams: string;
  };
}

export interface ShuMengLog {
  id: string;
  user_id: string;
  device_id: string;
  platform: string;
  event_code: string;
  risk_level: 'HIGH' | 'MEDIUM' | 'LOW';
  risk_tags: string;
  raw_response: string;
  created_at: string;
}

// --- Economy Management Types ---
export interface WithdrawalTask {
  id: string;
  name: string;
  count?: number;
  days?: number;
  reward?: number;
  condition?: string;
  status?: boolean;
}

export interface EconomyRule {
  id: string;
  minBalance: number;
  maxBalance: number;
  interstitialProb: number;
  rewardedProb: number;
  rhythms: Record<string, number>;
}

export interface EconomyConfig {
  rhythmKeys: string[];
  rules: EconomyRule[];
  withdrawalTasks: WithdrawalTask[];
  queue: {
    enabled: boolean;
    initialRank: number;
    totalRank: number;
    advancements: number[];
  };
}
