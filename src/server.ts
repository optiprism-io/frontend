import { createServer } from "miragejs";
import { EventStatus } from "./types";

export default function ({ environment = "development" } = {}) {
    return createServer({
        routes() {
            this.namespace = "api";
            this.timing = 300;

            this.get("/schema/events", () => {
                return [
                    {
                        id: 1,
                        createdAt: new Date(),
                        createdBy: 0,
                        updatedBy: 0,
                        projectId: 0,
                        tags: ["Onboarding"],
                        name: "Sign Up",
                        description: "When user signs up",
                        status: EventStatus.Enabled
                    },
                    {
                        id: 2,
                        createdAt: new Date(),
                        createdBy: 0,
                        updatedBy: 0,
                        projectId: 0,
                        tags: ["General"],
                        name: "Search",
                        description: "Search",
                        status: EventStatus.Enabled,
                        properties: [1]
                    },
                    {
                        id: 3,
                        createdAt: new Date(),
                        createdBy: 0,
                        updatedBy: 0,
                        projectId: 0,
                        tags: ["General"],
                        name: "View Product",
                        description: "View product",
                        status: EventStatus.Enabled,
                        properties: [2, 3, 4]
                    },
                    {
                        id: 4,
                        createdAt: new Date(),
                        createdBy: 0,
                        updatedBy: 0,
                        projectId: 0,
                        tags: ["Revenue"],
                        name: "Add Product to Cart",
                        description: "Add Product to Cart",
                        status: EventStatus.Enabled,
                        properties: [5, 6, 7]
                    },
                    {
                        id: 5,
                        createdAt: new Date(),
                        createdBy: 0,
                        updatedBy: 0,
                        projectId: 0,
                        tags: ["Revenue"],
                        name: "Purchase Product",
                        description: "When product was purchased",
                        status: EventStatus.Enabled,
                        properties: [8, 9, 10, 11, 12]
                    }
                ];
            });

            this.get("/schema/custom-events", () => {
                return [
                    {
                        id: 5,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        createdBy: 0,
                        updatedBy: 0,
                        projectId: 0,
                        isSystem: true,
                        status: EventStatus.Enabled,
                        name: "Custom event",
                        description: "This is custom event",
                        tags: ["1"]
                    }
                ];
            });
        }
    });
}
