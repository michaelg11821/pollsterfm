import { setupServer } from "msw/node";

export const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
