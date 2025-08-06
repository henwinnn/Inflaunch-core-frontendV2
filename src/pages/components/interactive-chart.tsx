"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import TradingView from "../TradingView";
import { OHLCData, UseOHLCReturn } from "@/src/hooks/useOHLC";

interface InteractiveChartProps {
  tokenName?: string;
  pair?: `0x${string}`;
  newOHLC: OHLCData[] | null;
}

export function InteractiveChart({
  tokenName = "Token",
  pair,
  newOHLC,
}: InteractiveChartProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle>{tokenName} Price Chart</CardTitle>
        <CardDescription>
          Past 7 days performance (example data)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TradingView pair={pair} newOHLC={newOHLC} />
      </CardContent>
    </Card>
  );
}
