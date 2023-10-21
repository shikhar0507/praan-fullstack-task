import mongoose, { Document, model,Model, Schema } from 'mongoose';

interface ISensorData {
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
const DailyAveragesModel: Model<IDailyAverages> = mongoose.model('DailyAverages', new Schema<IDailyAverages>({
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


async function calculateDailyAverages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI ||  'mongodb://localhost:27017/praan');

    // Calculate daily averages
    const result = await SensorDataModel.aggregate([
       
      {
        $group: {
         _id: {
            $dateToString: { format: '%Y-%m-%d', date: { $toDate: "$timestamp" }  }
          },
          p1: { $avg: '$p1' },
          p25: { $avg: '$p25' },
          p10: { $avg: '$p10' },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          p1: 1,
          p10: 1,
          p25: 1
        }
      }
    ]);

    await DailyAveragesModel.deleteMany({})
    
    // Store the daily averages
    await DailyAveragesModel.insertMany(result);
    console.log("Daily averages calculated")
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

calculateDailyAverages();
