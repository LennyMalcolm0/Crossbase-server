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

app.use("/api/*", validateUser);

app.get("/api/insights/prompt",
  async (req: Request, res: Response) => {
    // const { currentUser } = req.body;

    // const store = await prisma.store.findFirst({
    //   where: {
    //     userId: currentUser.uid,
    //     url: "kingbethel.myshopify.com",
    //   },
    //   select: {
    //     url: true,
    //     type: true
    //   }
    // });

    res.status(200).send("store");
  }
);

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