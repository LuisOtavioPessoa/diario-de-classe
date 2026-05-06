import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI não foi definida no arquivo .env");
    }

    await mongoose.connect(mongoUri);

    console.log("Conectado ao MongoDB");
  } catch (error) {
    console.error("Deu erro ao conectar com o MongoDB:", error);
    process.exit(1);
  }
};

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.get("/", (req, res) => {
//   res.json({
//     message: "Games API funcionando",
//     endpoints: {
//       games: "/games",
//     },
//   });
// });

// app.use(routes);
// app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`O servidor está rodando na porta ${PORT}`);

  if (process.env.NODE_ENV !== "production") {
    console.log(`Games: http://localhost:${PORT}/games`);
  }
});
