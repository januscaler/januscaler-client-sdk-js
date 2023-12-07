export interface JanusScalerClientAudioBridgeCreateRoomPayload {
    request: 'create' | 'edit'
    id?: string | number
    room: string | number
    permanent?: boolean
    description?: string
    secret?: string
    pin?: string
    is_private?: boolean
    allowed?: string[]
    sampling_rate?: number
    spatial_audio?: boolean
    audiolevel_ext?: boolean
    audiolevel_event?: boolean
    audio_active_packets?: number
    audio_level_average?: number
    default_prebuffering?: number
    default_expectedloss?: number
    default_bitrate?: number
    record?: boolean
    record_file?: string
    record_dir?: string
    mjrs?: boolean
    mjrs_dir?: string
    allow_rtp_participants?: boolean
    groups?: string[]
}

export interface JanusScalerClientAudioBridgeJoinRoomPayload {
    request: 'join'
    room: string | number
    id: string | number
    group: string
    pin: string
    display: string
    token: string
    muted: boolean
    codec: string
    prebuffer: any
    bitrate: number
    quality: number
    expected_loss: number
    volume: number
    spatial_position: number
    secret: string
    audio_level_average: any
    audio_active_packets: any
    record: boolean
    filename: string
}