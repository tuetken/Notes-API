export function sendResponse(res, status, response) {
  return res.status(status).json({ message: response });
}
