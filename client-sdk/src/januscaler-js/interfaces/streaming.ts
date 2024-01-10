export interface JanusScalerClientStreamingConfigurePayload {
  mid: string;
  send: boolean;
  substream: 0 | 1 | 2;
  temporal: 0 | 1 | 2;
  fallback: number;
  spatial_layer: 0 | 1;
  temporal_layer: 0 | 1 | 2;
  min_delay: number;
  max_delay: number;
}

export interface JanusScalerClientStreamingSwitchPayload {
  id: number;
}

export interface JanusScalerClientStreamingWatchPayload {
  id: number;
  pin?: string;
  media?: string[];
  offer_audio?: boolean;
  offer_video?: boolean;
  offer_data?: boolean;
}

export interface JanusScalerClientStreamingRecordingPayload {
  action: "start" | "stop";
  id: number;
  media: {
    mid: string;
    filename: string;
  }[];
}

export interface JanusScalerClientStreamingKickAllPayload {
  id: number;
  secret?: string;
}

export interface JanusScalerClientStreamingDisablePayload {
  id: number;
  secret?: string;
  stop_recording: boolean;
}

export interface JanusScalerClientStreamingEnablePayload {
  id: number;
  secret?: string;
}

export interface JanusScalerClientStreamingResponseMediaItem {
  mid: string;
  label: string;
  msid: string;
  type: "audio" | "video" | "data";
  age_ms: number;
}

export interface JanusScalerClientStreamingDestroyResponse {
    streaming: 'destroyed'
    id: number
}

export interface JanusScalerClientStreamingListResponse {
  id: number;
  type: string;
  description: string;
  metadata: string;
  enabled: boolean;
  media: JanusScalerClientStreamingResponseMediaItem[];
}

export interface JanusScalerClientInfoResponseMediaItem {
  mid: string;
  mindex: number;
  type: "audio" | "video" | "data";
  label: string;
  msid: string;
  age_ms: number;
  pt: number;
  codec: string;
  rtpmap: any;
  fmtp: any;
}
export interface JanusScalerClientStreamingInfoResponse {
  id: number;
  name: string;
  description: string;
  metadata: string;
  secret: string;
  pin: string;
  is_private: boolean;
  viewers: number;
  enabled: boolean;
  type: string;
  media: JanusScalerClientInfoResponseMediaItem[];
}

export interface JanusScalerClientStreamingCreatedResponse {
  streaming: string;
  created: string;
  permanent: boolean;
  stream: {
    id: number;
    type: string;
    description: string;
    is_private: boolean;
    ports: {
      type: string;
      mid: string;
      port: number;
    }[];
  };
}

export interface JanusScalerClientStreamingEditPayload {
  id: number;
  secret?: string;
  new_description?: string;
  new_metadata?: string;
  new_secret?: string;
  new_pin?: string;
  new_is_private?: boolean;
  permanent?: boolean;
  edited_event?: boolean;
}

export interface JanusScalerClientStreamingEditResponse {
  streaming: "edited";
  id: number;
  permanent: boolean;
}

export interface JanusScalerClientStreamingInfoPayload {
  id: number | string;
  secret: string;
}

export interface JanusScalerClientStreamingCreatePayload {
  admin_key?: string;
  type: "rtp" | "live" | "ondemand" | "rtsp";
  id?: string | number;
  name?: string;
  description?: string;
  metadata?: any;
  secret?: string;
  pin?: string;
  is_private?: boolean;
  media: {
    type: "audio" | "video" | "data";
    mid: string;
    msid?: string;
    port: number;
    label?: string;
    pt: number;
    codec: string;
  }[];
  permanent?: boolean;
}

export interface JanusScalerClientStreamingDestroyPayload {
  id: string | number;
  secret?: string;
  permanent?: boolean;
}
