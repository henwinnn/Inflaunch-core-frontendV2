// import { Progress } from "./components/ui/progress";

import { Progress } from "./ui/progress";

interface BondingCurveProgressProps {
  value: number; // 0-100
}

export function BondingCurveProgress({ value }: BondingCurveProgressProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-sm text-muted-foreground">
        <span>Bonding Curve Progress</span>
        <span>{value}%</span>
      </div>
      <Progress value={value} className="h-3 [&>div]:bg-brand-gradient" />
      {/* Add micro-animation for progress change if desired */}
    </div>
  );
}
