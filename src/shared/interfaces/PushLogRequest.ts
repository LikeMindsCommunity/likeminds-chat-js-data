import { LMSeverity } from "../enums/severity";
// LMPushLogsRequest Interface
export interface LMPushLogsRequest {
    logs?: Log[]; // Required list of logs
}

// Log Interface
export interface Log {
    timestamp: number; // Required timestamp
    deviceMeta: LMDeviceDetails; // Required device metadata
    stackTrace: LMStackTrace; // Required stack trace
    sdkMeta?: LMSDKMeta; // Nullable SDK metadata
    severity?: LMSeverity; // Nullable severity level
}

// LMDeviceDetails Interface
export interface LMDeviceDetails {
    os: string;
    versionOS: string; // JSON Key: "version_os"
    deviceName: string; // JSON Key: "device_name"
    screenHeight: number; // JSON Key: "screen_height"
    screenWidth: number; // JSON Key: "screen_width"
    wifi: boolean; // true or false
}

// LMStackTrace Interface
export interface LMStackTrace {
    exception: string;
    trace: string;
}

// LMSDKMeta Interface
export interface LMSDKMeta {
    dataLayerVersion?: string; // JSON Key: "data_layer_version", nullable
    coreVersion?: string; // JSON Key: "core_version", nullable
}
