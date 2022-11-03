import  mongoose from "mongoose";

export const connectDB = async () => {
    try {
       await mongoose
            .connect(process.env.DB_URI!, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: true
            })
            .then((data) => {
                console.log(`Mongodb connected with server: ${data.connection.host}`);
            });
    } catch (error: any) {
        console.log(`Connection error:`, error.message);
    }

    const connection = mongoose.connection;

    connection.on("connected", () => {
        console.log("mongoDB connected!");
    });

    connection.on("disconnected", () => {
        console.log("mongoDB disconnected!");
    });
};


