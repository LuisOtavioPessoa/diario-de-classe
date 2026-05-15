import app from "./app";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.PORT || 3000;

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGO_URI não foi definida no arquivo .env"
      );
    }

    await mongoose.connect(mongoUri);

    console.log("Conectado ao MongoDB");

  } catch (error) {
    console.error(
      "Deu erro ao conectar com o MongoDB:",
      error
    );

    process.exit(1);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(
    `O servidor está rodando na porta ${PORT}`
  );
});