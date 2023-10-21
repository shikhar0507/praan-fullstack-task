import mongoose, { Document, model,Model, Schema } from 'mongoose';

export interface ISensorData {
    device: string,
    windDirection: string,
    windSpeed: number,
    timestamp: number,
    p1: number,
    p25: number,
    p10: number
}

interface IDailyAverages {
    date: string,
    p1: number,
    p25: number,
    p10: number
}

interface IUser extends Document {
    email: string,
    password: string,
    roles: string[],
    permissions : string[],
    name: string,
    created_at: Date
}


export const DailyAveragesModel: Model<IDailyAverages> = mongoose.model('DailyAverages', new Schema<IDailyAverages>({
    date: {
        type: String,
        required: true,
    },
    p1: {
        type: Number,
        required: true
    },
    p25: {
        type: Number,
        required: true
    },
    p10: {
        type: Number,
        required: true
    }
}));



export const SensorDataModel: Model<ISensorData> = model<ISensorData>('devices',new Schema<ISensorData>({
    device: {
        type: String,
        required: true
    },
    windDirection: {
        type: String,
        required: true
    },
    windSpeed: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Number,
        required: true,
        index: true
    },
    p1: {
        type: Number,
        required: true
    },
    p25: {
        type: Number,
        required: true
    },
    p10: {
        type: Number,
        required: true
    }
}));


export const UserDataModel: Model<IUser>  = mongoose.model('users', new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: Date,
    email: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        required: true,
    },
    permissions:{
        type: [String],
        required: true
    }
}))

