const MICROSERVICE_NAME = "gateway";
const { NODE_ENV } = process.env;

export const clientId = (prefix: string) => `${MICROSERVICE_NAME}.${prefix}.${NODE_ENV}`;
export const groupId = (prefix: string) => `${prefix}.${NODE_ENV}`;
