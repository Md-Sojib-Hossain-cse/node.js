import type { IncomingMessage, ServerResponse } from "http";
import { productController } from "../controllers/product.controller";

export const routeHandler = (req: IncomingMessage, res: ServerResponse) => {
  // console.log(req.url);
  // console.log(req.method);

  const url = req.url;
  const method = req.method;

  if (url === "/" && method === "GET") {
    console.log("this is root route");
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Root route" }));
  } else if (url?.startsWith("/products")) {
    productController(req, res);
  } else {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found!" }));
  }
};
