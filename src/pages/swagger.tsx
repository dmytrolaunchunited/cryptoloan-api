import { GetStaticProps, InferGetStaticPropsType } from "next";
import { createSwaggerSpec } from "next-swagger-doc";
import { memo } from "react";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import "./swagger.css";

interface Props {
  spec: any;
}

const ssr = false;
const SwaggerUI = dynamic<Props>(import("swagger-ui-react"), { ssr });

export default memo(({ spec }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <SwaggerUI spec={spec} />;
})

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "CryptoLoan API Documentation",
        version: "1.0.0",
        description:
          "Comprehensive API documentation for CryptoLoan, a platform for managing crypto-backed loans. " +
          "This documentation covers all available endpoints, authentication methods, and data models. " +
          "Use the endpoints below to interact with the system. Most endpoints require authentication via the `X-API-KEY` header.",
        contact: {
          name: "CryptoLoan Support",
          email: "support@cryptoloan.com",
          url: "https://cryptoloan.com/support",
        },
        license: {
          name: "MIT",
          url: "https://opensource.org/licenses/MIT",
        },
      },
      servers: [
        {
          url: "https://api.cryptoloan.com",
          description: "Production server",
        },
        {
          url: "http://localhost:3000",
          description: "Local development server",
        },
      ],
      tags: [
        {
          name: "admin",
          description:
            "Administrative operations: manage users, system settings, and perform privileged actions. Only accessible to administrators.",
        },
        {
          name: "user",
          description:
            "User operations: registration, authentication, profile management, and user-specific actions.",
        },
        {
          name: "question",
          description:
            "Question management: create, update, delete, and retrieve questions and answers related to the platform.",
        },
        {
          name: "application",
          description:
            "Loan application operations: submit, review, and manage crypto-backed loan applications.",
        },
        {
          name: "auth",
          description:
            "Authentication operations: login, logout, token refresh, and related authentication endpoints.",
        },
      ],
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "X-API-KEY",
            description: "API key required for authentication. Obtain your API key from your account dashboard.",
          },
        },
      },
      security: [
        {
          ApiKeyAuth: [],
        },
      ],
    },
  });
  const props = { spec };
  return { props };
};
