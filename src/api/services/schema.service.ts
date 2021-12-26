import { get } from "../apiClient";

const schemaService = {
    events: async () => await get("/schema/events", "", null),
    customEvents: async () => await get("/schema/custom-events", "", null),
    eventProperties: async () => await get("/schema/event-properties", "", null),
    eventCustomProperties: async () => await get("/schema/event-custom-properties", "", null)
};

export default schemaService;
