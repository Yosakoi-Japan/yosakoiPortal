import { createError, defineEventHandler, getRouterParam } from "h3";
import { loadEventById } from "../../utils/events";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing event id",
    });
  }

  try {
    const eventDetail = await loadEventById(id);

    if (!eventDetail) {
      throw createError({
        statusCode: 404,
        statusMessage: "Event not found",
      });
    }

    return eventDetail;
  } catch (error) {
    if (error instanceof Error && error.message === "DUPLICATE_EVENT_ID") {
      throw createError({
        statusCode: 500,
        statusMessage: "DUPLICATE_EVENT_ID",
      });
    }

    throw error;
  }
});
