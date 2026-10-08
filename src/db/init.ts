import * as mongoose from "mongoose";

export async function run(DB_LINK: string) {

    const clientOptions = {serverApi: {version: '1', strict: true, deprecationErrors: true}};
    try {

        await mongoose.connect(DB_LINK, clientOptions as Object);
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.error("Erreur connexion MongoDB:", err);
        await mongoose.disconnect();
        throw err;
    }
}