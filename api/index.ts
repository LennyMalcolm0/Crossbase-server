import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from 'cors';
import { prisma, validateUser } from "./lib";
import { 
  profileRoutes, 
  storeRoutes, 
  insightRoutes 
} from "./routes";

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

app.use(cors());

app.get("/", (_, res) => {
  res.status(200).send({
      "name": "Crossbase",
      "type": "test",
      "price": 450,
  });
})

app.use("/api/*", validateUser);

app.use("/api/profile", profileRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/insights", insightRoutes);

prisma.$connect;

const port = process.env.PORT;

try {
  app.listen(port, () => console.log(`Connected`));
} catch (error) {
  console.error(error);
} 