import { Elysia } from "elysia";
import { autumnHandler } from "autumn-js/elysia"
import cors from "@elysiajs/cors"

const app = new Elysia().get("/", () => "Hello Elysia").use(cors({
  origin: "http://localhost:5173"
})).use(autumnHandler({
  identify: () => {
    return Promise.resolve({
      customerId: "elysia-test",
      customerData: {
        name: "John Doe",
        email: "john.doe@example.com"
      }
    })
  }
})).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);