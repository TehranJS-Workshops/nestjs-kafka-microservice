import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export async function setupSwagger(app, prefix: string) {
  try {
    const title = "API documentation";
    const description = "API documentation and endpoints";
    const swaggerPath = `${prefix}/docs`;
    const options = new DocumentBuilder().setTitle(title).setDescription(description).build();

    const document = SwaggerModule.createDocument(app, options);
    await SwaggerModule.setup(swaggerPath, app, document, {
      customSiteTitle: title,
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        deepLinking: true,
        syntaxHighlight: {
          activate: true,
          theme: "tomorrow-night",
        },
        requestSnippetsEnabled: true,
        requestSnippets: {
          generators: {
            curl_bash: {
              title: "cURL (bash)",
              syntax: "bash",
            },
            curl_cmd: {
              title: "cURL (CMD)",
              syntax: "bash",
            },
          },
          defaultExpanded: true,
          languages: null,
        },
      },
    });

    return swaggerPath;
  } catch (e) {
    throw e;
  }
}
