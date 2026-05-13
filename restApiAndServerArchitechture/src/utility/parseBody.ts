import type { IncomingMessage, ServerResponse } from "http";

export const parseBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
};

export const sendResponse = (
  res: ServerResponse,
  success: boolean,
  message: string,
  data: any,
  statusCode: number,
) => {
  res.writeHead(statusCode, { "content-type": "application/json" });
  res.end(
    JSON.stringify({
      message: message,
      data: data || null,
    }),
  );
};
