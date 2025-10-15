import { GetStaticProps, InferGetStaticPropsType } from "next";
import { createSwaggerSpec } from "next-swagger-doc";
import { memo } from "react";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import "swagger.css";

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
        title: "CryptoLoan Swagger API",
        version: "0.0.1",
      },
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "X-API-KEY",
          },
        },
      },
      security: [],
    },
  });
  const props = { spec };
  return { props };
};
