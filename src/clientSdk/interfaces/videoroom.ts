export interface JanusScalerClientVideoRoomCreatePayload {}

export interface JanusScalerClientVideoRoomClientDescription {
  mid: string;
  description: string;
}
export interface JanusScalerClientVideoRoomClientPublishPayload {
  audiocodec?: string;
  videocodec?: string;
  bitrate?: number;
  record?: boolean;
  filename?: string;
  display?: string;
  audio_level_average?: number;
  audio_active_packets?: number;
  descriptions?: JanusScalerClientVideoRoomClientDescription[];
}

export interface JanusScalerClientVideoRoomClientConfigureDescription {
  mid: string;
  description?: string;
}

export interface JanusScalerClientVideoRoomClientConfigureStream {
  mid: string;
  keyframe?: boolean;
  send?: boolean;
  min_delay?: number;
  max_delay?: number;
  substream?: 0 | 1 | 2;
  temporal?: 0 | 1 | 2;
  fallback?: number;
  spatial_layer?: 0 | 1 | 2;
  temporal_layer?: 0 | 1 | 2;
  audio_level_average?: number;
  audio_active_packets?: number;
}

export interface JanusScalerClientVideoRoomClientConfigurePayload {
  restart?: boolean;
  bitrate?: number;
  keyframe?: boolean;
  record?: boolean;
  filename?: string;
  display?: string;
  audio_active_packets?: number;
  audio_level_average?: number;
  streams?: JanusScalerClientVideoRoomClientConfigureStream[];
  descriptions?: JanusScalerClientVideoRoomClientConfigureDescription[];
}

export interface JanusScalerClientVideoRoomClientJoinStreams {
  feed: number;
  mid?: string;
  crossrefid?: string;
}
export interface JanusScalerClientVideoRoomClientJoinPayload {
  ptype: "publisher" | "subscriber";
  room: number | string;
  id?: number;
  display?: string;
  token?: string;
  use_msid?: boolean;
  autoupdate?: boolean;
  private_id?: number;
  streams?: JanusScalerClientVideoRoomClientJoinStreams[];
}
