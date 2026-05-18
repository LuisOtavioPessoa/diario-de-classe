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

    console.log("MongoDB conectado com sucesso");

    app.listen(PORT, () => {
      console.log(
        `Servidor rodando na porta ${PORT}`
      );
    });

  } catch (error) {
    console.error(
      "Erro ao conectar com o MongoDB:",
      error
    );

    process.exit(1);
  }
};

connectDB();