import { get } from "../apiClient";

const schemaService = {
    events: async () => await get("/schema/events", "", null),
    customEvents: async () => await get("/schema/custom-events", "", null)
};

export default schemaService;
