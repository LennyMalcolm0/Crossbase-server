import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from 'cors';
import { prisma, validateUser } from "./lib";
import { 
  profileRoutes, 
  storeRoutes, 
  insightRoutes 
} from "./routes";
import { testStream } from "./controllers/test.stream";

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

app.use(cors());

app.use("/api/*", validateUser);

app.get(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
      return res.status(200).send({
          userId: "dvbvscvdczdv",
          firstName: "Kyle",
          lastName: "Michael"
      });
  }
);
app.use("/api/stream", testStream);

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