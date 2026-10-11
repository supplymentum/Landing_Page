"use client";

import { useCountUp } from "@/hooks/useCountUp";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  className?: string;
}

export default function AnimatedCounter({ value, prefix = "", className = "" }: AnimatedCounterProps) {
  const { ref, value: current } = useCountUp<HTMLDivElement>(value);

  return (
    <div ref={ref} className={className}>
      {prefix}
      {current}
    </div>
  );
}
