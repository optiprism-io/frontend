import { get } from "../apiClient";

// TODO examples fetch service
const appService = {
    app: async () => await get("app", "", null)
};

export default appService;
