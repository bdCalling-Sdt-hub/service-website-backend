import express, { Request, Response, NextFunction } from "express";
import { CustomError } from "./utils/error";
import routes from "./routes";
import responseBuilder from "./utils/responseBuilder";

const app = express();

app.use(express.json());

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
      return response
        .status(error.status)
        .json(responseBuilder(false, error.status, error.message));
    } else {
      const randomMessage = "Internal Server Error";
        // errorMessages[Math.floor(Math.random() * errorMessages.length)];

      return response
        .status(500)
        .json(responseBuilder(false, 500, randomMessage));
    }
  }
);

app.get("/", (_: Request, response: Response) => {
  response.send("BASP API");
});

app.get("/health", (_: Request, response: Response) => {
  response.send("OK");
});

export default app;
