import { useRef, useEffect, useState } from "react";
import {
  CandlestickSeries,
  createChart,
  ColorType,
  UTCTimestamp,
} from "lightweight-charts";
import { OHLCData, useOHLC } from "../hooks/useOHLC";

export default function TradingView({
  pair,
  newOHLC,
}: {
  pair?: `0x${string}`;
  newOHLC: OHLCData[] | null;
}) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { loading, error, refetch } = useOHLC(pair || "");
  const [timezone, setTimezone] = useState("Asia/Jakarta"); // Default ke WIB
  // Function untuk convert UTC timestamp ke timezone tertentu
  const convertToTimezone = (utcTimestamp: number, targetTimezone: string) => {
    if (targetTimezone === "UTC") return utcTimestamp;

    // Convert UTC timestamp to local timezone
    const utcDate = new Date(utcTimestamp * 1000);

    // Get offset for target timezone
    const localString = utcDate.toLocaleString("en-CA", {
      timeZone: targetTimezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    // Parse back to timestamp
    const localDate = new Date(localString.replace(", ", "T"));
    return Math.floor(localDate.getTime() / 1000);
  };

  // Get current time info for display
  const getCurrentTimeInfo = () => {
    const now = new Date();
    const utcTime = now.toISOString().slice(0, 19).replace("T", " ") + " UTC";
    const localTime = now.toLocaleString("id-ID", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    return { localTime, utcTime };
  };

  const [currentTime, setCurrentTime] = useState(getCurrentTimeInfo());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeInfo());
    }, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  useEffect(() => {
    if (
      !chartContainerRef.current ||
      loading ||
      !newOHLC ||
      newOHLC.length === 0
    ) {
      return;
    }

    // Create continuous artificial candlesticks with timezone conversion
    const chartData = newOHLC
      .filter((item: any) => {
        return (
          item.time &&
          item.open > 0 &&
          item.high > 0 &&
          item.low > 0 &&
          item.close > 0
        );
      })
      .map((item: any, index: number) => {
        const currentPrice = parseFloat(item.close);
        const prevPrice =
          index > 0
            ? parseFloat(String(newOHLC[index - 1].close))
            : currentPrice;

        // Convert UTC time to selected timezone
        const localTime = convertToTimezone(item.time, timezone);

        // PENTING: Ensure continuity - open = previous close
        const open = index === 0 ? currentPrice : prevPrice;
        const close = currentPrice;

        // Determine direction
        const isUp = close >= open;
        const priceChange = Math.abs(close - open);

        // Create artificial spread (minimum 2% untuk visibility)
        const baseSpread = Math.max(priceChange, currentPrice * 0.02);

        let high, low;

        if (isUp) {
          // Green candle: open < close
          high = Math.max(open, close) + baseSpread * 0.3;
          low = Math.min(open, close) - baseSpread * 0.2;
        } else {
          // Red candle: open > close
          high = Math.max(open, close) + baseSpread * 0.2;
          low = Math.min(open, close) - baseSpread * 0.3;
        }

        // Ensure OHLC rules: low <= open,close <= high
        const finalHigh = Math.max(high, open, close);
        const finalLow = Math.min(low, open, close);

        return {
          time: localTime as UTCTimestamp, // Use converted local time
          open: Math.max(open, 0),
          high: Math.max(finalHigh, 0),
          low: Math.max(finalLow, 0), // Prevent negative prices
          close: Math.max(close, 0),
        };
      });

    // Chart options with timezone support
    const chartOptions = {
      layout: {
        textColor: "white",
        background: { type: ColorType.Solid, color: "#110e15" },
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      // Localization for time formatting
      localization: {
        locale: timezone === "Asia/Jakarta" ? "id-ID" : "en-US",
        timeFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return date.toLocaleTimeString(
            timezone === "Asia/Jakarta" ? "id-ID" : "en-US",
            {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }
          );
        },
        dateFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return date.toLocaleDateString(
            timezone === "Asia/Jakarta" ? "id-ID" : "en-US",
            {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            }
          );
        },
      },
    };

    const chart = createChart(chartContainerRef.current, chartOptions);

    const prices = chartData.flatMap((d) => [d.open, d.high, d.low, d.close]);
    const maxPrice = Math.max(...prices);

    let precision = 6;
    let minMove = 0.000001;

    if (maxPrice < 0.000001) {
      precision = 12;
      minMove = 0.000000000001;
    } else if (maxPrice < 0.001) {
      precision = 9;
      minMove = 0.000000001;
    }

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: true,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      priceFormat: {
        type: "price",
        precision: precision,
        minMove: minMove,
      },
    });

    candlestickSeries.setData(chartData);

    chart.timeScale().applyOptions({
      barSpacing: 25,
      minBarSpacing: 10,
      rightOffset: 10,
      timeVisible: true,
      secondsVisible: false,
    });

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [newOHLC, loading, timezone]); // Add timezone as dependency

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        Loading chart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!newOHLC || newOHLC.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        No chart data available
      </div>
    );
  }

  const timezoneOptions = [
    { value: "Asia/Jakarta", label: "WIB (UTC+7)", offset: "+7" },
    { value: "Asia/Makassar", label: "WITA (UTC+8)", offset: "+8" },
    { value: "Asia/Jayapura", label: "WIT (UTC+9)", offset: "+9" },
    { value: "UTC", label: "UTC", offset: "+0" },
    { value: "America/New_York", label: "EST (UTC-5)", offset: "-5" },
    { value: "Europe/London", label: "GMT (UTC+0)", offset: "+0" },
  ];

  return (
    <div className="w-full">
      {/* Timezone Controls */}
      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Timezone Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300 font-medium">
              Timezone:
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="bg-gray-700 text-white text-sm p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              {timezoneOptions.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          {/* Current Time Display */}
          <div className="text-xs text-gray-400">
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <span>
                🕐 Local:{" "}
                <span className="text-white">{currentTime.localTime}</span>
              </span>
              <span>
                🌍 UTC:{" "}
                <span className="text-gray-300">{currentTime.utcTime}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div
        ref={chartContainerRef}
        style={{
          width: "100%",
          height: "400px",
          position: "relative",
          minWidth: "300px",
        }}
      />
    </div>
  );
}
