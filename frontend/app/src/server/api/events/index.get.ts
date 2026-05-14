import { defineEventHandler } from "h3";
import { loadEventList } from "../../utils/events";

export default defineEventHandler(async () => {
  return await loadEventList();
});
