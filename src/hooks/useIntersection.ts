"use client";

import { RefObject, useEffect, useState } from "react";

export function useIntersection(
  targetRef: RefObject<Element | null>,
  rootMargin = "0px"
) {
  const [isIntersecting, setIsIntersecting] = useState(true);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { rootMargin }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [targetRef, rootMargin]);

  return isIntersecting;
}
