// test/ConvexReactClientFake.ts
import type { Watch } from "convex/react";
import type {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
} from "convex/server";
import { getFunctionName } from "convex/server";

/**
 * A minimal fake ConvexReactClient for testing React components.
 *
 * Usage:
 *   const client = new ConvexReactClientFake<typeof api>();
 *   client.registerQueryFake(api.counter.getCounter, ({ counterName }) => 0);
 *   client.registerMutationFake(api.counter.incrementCounter, async () => {});
 */
export class ConvexReactClientFake {
  private queries: Record<
    string,
    (args: unknown) => unknown | Promise<unknown>
  > = {};
  private mutations: Record<
    string,
    (args: unknown) => unknown | Promise<unknown>
  > = {};
  private actions: Record<
    string,
    (args: unknown) => unknown | Promise<unknown>
  > = {};

  registerQueryFake<Query extends FunctionReference<"query">>(
    funcRef: Query,
    impl: (args: FunctionArgs<Query>) => FunctionReturnType<Query>,
  ) {
    this.queries[getFunctionName(funcRef)] = impl;
  }

  registerMutationFake<Mutation extends FunctionReference<"mutation">>(
    funcRef: Mutation,
    impl: (args: FunctionArgs<Mutation>) => FunctionReturnType<Mutation>,
  ) {
    this.mutations[getFunctionName(funcRef)] = impl;
  }

  registerActionFake<Action extends FunctionReference<"action">>(
    funcRef: Action,
    impl: (args: FunctionArgs<Action>) => FunctionReturnType<Action>,
  ) {
    this.actions[getFunctionName(funcRef)] = impl;
  }

  // ---- Auth API ----

  async setAuth(): Promise<void> {
    throw new Error("Auth is not implemented in ConvexReactClientFake");
  }

  clearAuth(): void {
    throw new Error("Auth is not implemented in ConvexReactClientFake");
  }

  // ---- Query API ----

  watchQuery<Query extends FunctionReference<"query">>(
    functionReference: Query,
    args: FunctionArgs<Query>,
  ): Watch<FunctionReturnType<Query>> {
    const name = getFunctionName(functionReference);

    return {
      localQueryResult: () => {
        const query = this.queries[name];
        if (!query) {
          throw new Error(
            `Unexpected query: ${name}. Try registering a fake with registerQueryFake.`,
          );
        }
        // Cast because we store in a loose Record<string, fn>
        return query(args) as FunctionReturnType<Query>;
      },
      onUpdate: () => {
        // In tests we usually don't need realtime updates; return an unsubscribe stub.
        return () => ({
          unsubscribe: () => null,
        });
      },
      journal: () => {
        throw new Error(
          "Pagination is not implemented in ConvexReactClientFake",
        );
      },
    };
  }

  // ---- Mutation API ----

  mutation<Mutation extends FunctionReference<"mutation">>(
    functionReference: Mutation,
    args: FunctionArgs<Mutation>,
  ): Promise<FunctionReturnType<Mutation>> {
    const name = getFunctionName(functionReference);
    const mutation = this.mutations[name];
    if (!mutation) {
      throw new Error(
        `Unexpected mutation: ${name}. Try registering a fake with registerMutationFake.`,
      );
    }
    return Promise.resolve(mutation(args) as FunctionReturnType<Mutation>);
  }

  // ---- Action API ----

  action<Action extends FunctionReference<"action">>(
    functionReference: Action,
    args: FunctionArgs<Action>,
  ): Promise<FunctionReturnType<Action>> {
    const name = getFunctionName(functionReference);
    const action = this.actions[name];
    if (!action) {
      throw new Error(
        `Unexpected action: ${name}. Try registering a fake with registerActionFake.`,
      );
    }
    return Promise.resolve(action(args) as FunctionReturnType<Action>);
  }

  // ---- Connection / lifecycle ----

  connectionState() {
    return {
      hasInflightRequests: false,
      isWebSocketConnected: true,
    };
  }

  close(): Promise<void> {
    return Promise.resolve();
  }
}
