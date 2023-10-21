export type SensorData  = {
    device: string
    wind_speed: number
    wind_direction: string
    timestamp : string
    p_1: number
    p_25: number
    p_10: number
}

export type getAllSensorDataRequestBody = {
    date_range: number[]
}