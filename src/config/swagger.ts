
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "Courier Management System API",
            version: "1.0.0",
            description: "API documentation for Courier and Shipment Management System"
        },

        servers: [
            {
                url: "http://localhost:5000",
                description: "Local Development Server"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },

    apis: ["./src/routes/*.ts", "./src/server.ts"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
