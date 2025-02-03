import CustomSidebar from "@/components/ui/CustomSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import { getMarketData } from "@/market";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function Market() {
  const [marketData, setMarketData] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadMarketData = async () => {
      try {
        const response = await getMarketData();
        if (response) {
          setMarketData(response);
        } else {
          setError("no data available");
        }
      } catch (error) {
        setError(error);
      }
    };
    loadMarketData();
  }, []);

  const formatNumber = (num) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  const getPriceChangeColor = (change) => {
    return change > 0 ? "text-green-500" : "text-red-500";
  };

  const formatPercentage = (value) => {
    if (!value) return "N/A";
    const formattedValue = value.toFixed(2);
    return `${value > 0 ? "+" : ""}${formattedValue}%`;
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <CustomSidebar />
        <div className="flex-1 p-8 space-y-6 overflow-x-auto">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Crypto Market</h1>
            <p className="text-muted-foreground">
              Live cryptocurrency prices, market cap, and trading volume
            </p>
          </div>

          <div className="rounded-xl border bg-card shadow-lg">
            <Table>
              <TableCaption className="text-sm text-muted-foreground pb-4">
                Real-time market data powered by CoinGecko API
              </TableCaption>
              <TableHeader>
                <TableRow className="hover:bg-muted/50 border-b">
                  <TableHead className="w-[50px] py-4">Asset</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Symbol</TableHead>
                  <TableHead className="text-center font-semibold">
                    Rank
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Price
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    24h Change
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Market Cap
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Market Cap Change 24h
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Volume (24h)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketData.map((coin) => (
                  <TableRow
                    key={coin.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="py-4">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{coin.name}</TableCell>
                    <TableCell className="uppercase text-muted-foreground">
                      {coin.symbol}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                        {coin.market_cap_rank}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${coin.current_price.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${getPriceChangeColor(
                        coin.price_change_percentage_24h
                      )}`}
                    >
                      {coin.price_change_percentage_24h > 0 ? "+" : ""}
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatNumber(coin.market_cap)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${getPriceChangeColor(
                        coin.market_cap_change_percentage_24h
                      )}`}
                    >
                      {formatPercentage(coin.market_cap_change_percentage_24h)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatNumber(coin.total_volume)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error loading market data</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Market;
