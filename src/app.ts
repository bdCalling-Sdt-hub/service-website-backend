import express, { Request, Response, NextFunction } from "express";
import { CustomError } from "./utils/error";
import routes from "./routes";
import responseBuilder from "./utils/responseBuilder";
import cors from "cors";
import morgan from "morgan";
import suburbs from "./suburbs.json";
import { createSuburbs, getSuburbs } from "./services/suburb";
import { createAdmin, getAdmin } from "./services/user";
import { hashPassword } from "./services/hash";

const app = express();

app.use(express.json());

app.use(morgan("combined"));

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
      const randomMessage = "Internal Server Error"; // errorMessages[Math.floor(Math.random() * errorMessages.length)];

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

getSuburbs({ limit: 1, skip: 0 }).then((data) => {
  if (data.length === 0) {
    createSuburbs(suburbs).then(() => {
      console.log("Suburbs created");
    });
  }
});

getAdmin().then(async (admin) => {
  if (!admin) {
    createAdmin({
      email: "admin@gmail.com",
      password: await hashPassword("123456"),
    }).then(() => console.log("Admin created"));
  }
});

export default app;
