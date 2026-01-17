"use client";

import { useEffect } from "react";

type AnalyticsProviderProps = {
  measurementId?: string;
  children: React.ReactNode;
};

export default function AnalyticsProvider({ measurementId, children }: AnalyticsProviderProps) {
  useEffect(() => {
    if (!measurementId) return;
    console.info(`GA4 initialized: ${measurementId}`);
  }, [measurementId]);

  return <>{children}</>;
}
