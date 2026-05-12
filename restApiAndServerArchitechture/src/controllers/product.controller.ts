import type { IncomingMessage, ServerResponse } from "http";
import { readProduct, writeProduct } from "../services/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parseBody";

export const productController = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url;
  const method = req.method;

  const urlParts = url?.split("/");

  const id =
    urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;

  //get all product
  if (url === "/products" && method === "GET") {
    const result = readProduct();
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products Retrieve Successfully!",
        data: result,
      }),
    );
  }
  //get single product
  else if (method === "GET" && id !== null) {
    const products = readProduct();
    const product = products.find((p: IProduct) => p.id === id);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product Retrieve Successfully!",
        data: product,
      }),
    );
  }
  //create product
  else if (method === "POST" && url === "/products") {
    const body = await parseBody(req);

    const newProduct = {
      id: Date.now(),
      ...body,
    };
    const products = readProduct();

    products.push(newProduct);

    writeProduct(products);

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product Retrieve Successfully!",
        data: newProduct,
      }),
    );
  }

  //update product
  else if (method === "PUT" && id !== null) {
    const body = await parseBody(req);

    const products = readProduct();

    const index = products.findIndex((p: IProduct) => p.id === id);

    if (index < 0) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "product not found!", data: null }));
    }

    products[index] = {
      id: products[index].id,
      ...body,
    };

    writeProduct(products);

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product updated Successfully!",
        data: products[index],
      }),
    );
  }

  // delete product
  else if (method === "DELETE" && id !== null) {
    const products = readProduct();
    const index = products.findIndex((p: IProduct) => p.id === id);

    if (index < 0) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "product not found!", data: null }));
    }

    products.splice(index, 1);

    writeProduct(products);

    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product deleted Successfully!",
        data: null,
      }),
    );
  }
};
