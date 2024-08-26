import express, { Request, Response, NextFunction } from "express";
import { CustomError } from "./utils/error";
import routes from "./routes";
import responseBuilder from "./utils/responseBuilder";
import cors from "cors";
import morgan from "morgan";
import { createManyAddress, getAddresses } from "./services/address";
import suburbs from "./suburbs.json";

const app = express();

app.use(express.json());

app.use(morgan("tiny"));

app.use(cors());
app.use(express.static("public"));

app.use(routes);

const errorMessages = [
  "You successfully failed!",
  "Congratulations, you broke it!",
  "Achievement unlocked: Server Error!",
  "Well done, you found our bug!",
  "Oops! You did it again!",
  "Bravo! You triggered an error!",
  "Nailed it! Error achieved!",
  "Hooray! You've confused the server!",
];

app.use(
  (error: CustomError, _: Request, response: Response, next: NextFunction) => {
    console.error(error);
    if (error.status) {
      return responseBuilder(response, {
        ok: false,
        statusCode: error.status,
        message: error.message,
      });
    } else {
      const randomMessage = "Internal Server Error";
      // errorMessages[Math.floor(Math.random() * errorMessages.length)];

      return responseBuilder(response, {
        ok: false,
        statusCode: 500,
        message: randomMessage,
      });
    }
  }
);

app.get("/", (_: Request, response: Response) => {
  response.send("BASP API");
});

app.get("/health", (_: Request, response: Response) => {
  response.send("OK");
});

getAddresses({ limit: 1, skip: 0 }).then((addresses) => {
  if (addresses.length === 0) {
    createManyAddress(suburbs).then(console.log).catch(console.error);
  }
});

export default app;
