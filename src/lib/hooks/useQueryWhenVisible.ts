import { type OptionalRestArgsOrSkip, useQuery } from "convex/react";
import type { FunctionReference } from "convex/server";
import type { RefObject } from "react";
import { useEffect, useState } from "react";

export function useQueryWhenVisible<
  Query extends FunctionReference<"query">,
  T extends Element,
>(
  query: Query,
  ref: RefObject<T | null>,
  ...args: OptionalRestArgsOrSkip<Query>
): Query["_returnType"] | undefined {
  const [isVisible, setIsVisible] = useState(false);
  const data = useQuery(
    query,
    ...(isVisible ? args : (["skip"] as OptionalRestArgsOrSkip<Query>)),
  );

  useEffect(() => {
    if (!ref.current || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [isVisible, ref]);

  return data;
}
