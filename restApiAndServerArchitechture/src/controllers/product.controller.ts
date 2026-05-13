import type { IncomingMessage, ServerResponse } from "http";
import { readProduct, writeProduct } from "../services/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody, sendResponse } from "../utility/parseBody";

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

    return sendResponse(
      res,
      true,
      "Product Retrieve Successfully!",
      result,
      200,
    );
  }
  //get single product
  else if (method === "GET" && id !== null) {
    const products = readProduct();
    const product = products.find((p: IProduct) => p.id === id);
    return sendResponse(
      res,
      true,
      "Product Retrieve Successfully!",
      product,
      200,
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

    return sendResponse(
      res,
      true,
      "Product Retrieve Successfully!",
      newProduct,
      200,
    );
  }

  //update product
  else if (method === "PUT" && id !== null) {
    const body = await parseBody(req);

    const products = readProduct();

    const index = products.findIndex((p: IProduct) => p.id === id);

    if (index < 0) {
      return sendResponse(res, false, "product not found!", null, 404);
    }

    products[index] = {
      id: products[index].id,
      ...body,
    };

    writeProduct(products);

    return sendResponse(
      res,
      true,
      "Product updated Successfully!",
      products[index],
      200,
    );
  }

  // delete product
  else if (method === "DELETE" && id !== null) {
    const products = readProduct();
    const index = products.findIndex((p: IProduct) => p.id === id);

    if (index < 0) {
      return sendResponse(res, false, "product not found!", null, 404);
    }

    products.splice(index, 1);

    writeProduct(products);

    return sendResponse(res, true, "Product deleted Successfully!", null, 200);
  }
};
