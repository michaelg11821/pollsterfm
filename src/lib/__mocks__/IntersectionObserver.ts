let mockIntersectionObserverCallback: IntersectionObserverCallback | null =
  null;

const observedElements = new Set<Element>();

export const mockObserve = vi.fn((element: Element) => {
  observedElements.add(element);
});

export const mockUnobserve = vi.fn((element: Element) => {
  observedElements.delete(element);
});

export const mockDisconnect = vi.fn(() => {
  observedElements.clear();
});

export const IntersectionObserverMock = vi
  .fn()
  .mockImplementation(
    (
      callback: IntersectionObserverCallback,
      options?: IntersectionObserverInit,
    ) => {
      mockIntersectionObserverCallback = callback;

      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
        root: options?.root || null,
        rootMargin: options?.rootMargin || "0px 0px 0px 0px",
        thresholds: options?.threshold
          ? Array.isArray(options.threshold)
            ? options.threshold
            : [options.threshold]
          : [0],
        takeRecords: vi.fn((): IntersectionObserverEntry[] => {
          const entries: IntersectionObserverEntry[] = [];
          observedElements.forEach((el) => {
            entries.push({
              boundingClientRect: el.getBoundingClientRect(),
              intersectionRatio: 0,
              intersectionRect: el.getBoundingClientRect(),
              isIntersecting: false,
              rootBounds: null,
              target: el,
              time: performance.now(),
            });
          });
          return entries;
        }),
      };
    },
  );

export const simulateIntersection = (
  targetElement: Element,
  isIntersecting: boolean,
) => {
  if (mockIntersectionObserverCallback && observedElements.has(targetElement)) {
    const entry: IntersectionObserverEntry = {
      boundingClientRect: targetElement.getBoundingClientRect(),
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: targetElement.getBoundingClientRect(),
      isIntersecting,
      rootBounds: document.documentElement?.getBoundingClientRect() || null,
      target: targetElement,
      time: performance.now(),
    };

    const observerInstance =
      IntersectionObserverMock.mock.instances[
        IntersectionObserverMock.mock.instances.length - 1
      ];

    mockIntersectionObserverCallback(
      [entry],
      observerInstance as IntersectionObserver,
    );
  } else {
    if (!mockIntersectionObserverCallback) {
      console.warn(
        "Simulate Intersection: No callback registered for IntersectionObserver.",
      );
    }
    if (!observedElements.has(targetElement)) {
      console.warn(
        "Simulate Intersection: Target element was not observed or is no longer observed.",
        targetElement,
      );
    }
  }
};
