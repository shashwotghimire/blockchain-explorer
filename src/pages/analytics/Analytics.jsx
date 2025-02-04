import CustomSidebar from "@/components/ui/CustomSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { React, useEffect, useState } from "react";
import { getTransactionHistory } from "@/blockchain";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

function Analytics() {
  const [chartData, setChartData] = useState(null);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = async () => {
    if (!address) {
      setError("Please enter an address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await getTransactionHistory(address);

      if (!response || !response.result || !Array.isArray(response.result)) {
        setError("No transaction data found");
        setChartData(null);
        return;
      }

      // Get date one month ago
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      // Filter and sort transactions from last month
      const lastMonthTransactions = response.result
        .filter((tx) => {
          const txDate = new Date(parseInt(tx.timeStamp) * 1000);
          return txDate >= oneMonthAgo;
        })
        .sort((a, b) => parseInt(a.timeStamp) - parseInt(b.timeStamp));

      if (lastMonthTransactions.length === 0) {
        setError("No transactions found in the last month");
        return;
      }

      // Create a map of all days in the last month
      const dateMap = {};
      const currentDate = new Date(oneMonthAgo);
      const today = new Date();

      while (currentDate <= today) {
        const dateKey = currentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        dateMap[dateKey] = {
          totalVolume: 0,
          count: 0,
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Populate the transactions data
      lastMonthTransactions.forEach((tx) => {
        const date = new Date(parseInt(tx.timeStamp) * 1000);
        const dateKey = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        if (dateMap[dateKey]) {
          const value = parseFloat(tx.value) / 1e18;
          dateMap[dateKey].totalVolume += value;
          dateMap[dateKey].count += 1;
        }
      });

      // Convert to chart data
      const dates = Object.keys(dateMap);

      setChartData({
        labels: dates,
        datasets: [
          {
            label: "Transaction Volume (ETH)",
            data: dates.map((date) => dateMap[date].totalVolume.toFixed(4)),
            borderColor: "rgb(99, 102, 241)",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: "rgb(99, 102, 241)",
            fill: true,
            tension: 0.2,
            yAxisID: "volume",
          },
          {
            label: "Number of Transactions",
            data: dates.map((date) => dateMap[date].count),
            borderColor: "rgb(245, 158, 11)",
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: "rgb(245, 158, 11)",
            fill: true,
            tension: 0.2,
            yAxisID: "count",
          },
        ],
      });
    } catch (error) {
      setError("Error fetching transaction data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      volume: {
        type: "linear",
        position: "left",
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: (value) => `${value} ETH`,
        },
        title: {
          display: true,
          text: "Volume (ETH)",
        },
      },
      count: {
        type: "linear",
        position: "right",
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Number of Transactions",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.dataset.label === "Transaction Volume (ETH)") {
              return `Volume: ${context.parsed.y} ETH`;
            }
            return `Transactions: ${context.parsed.y}`;
          },
        },
      },
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
            weight: "bold",
          },
          padding: 20,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  return (
    <SidebarProvider>
      <CustomSidebar />
      <div className="flex-1 min-h-screen bg-background">
        <div className="flex-1 p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              Analyze Ethereum address transaction history
            </p>
          </div>

          <Alert className="p-6">
            <Search className="h-4 w-4" />
            <AlertTitle className="text-xl mb-4">
              Enter your Ethereum address:
            </AlertTitle>
            <AlertDescription className="space-y-4">
              <Input
                type="text"
                placeholder="Enter Ethereum Address (0x...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-12"
              />
              <Button
                onClick={fetchTransactions}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Loading..." : "Analyze Transactions"}
              </Button>
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Transaction History Analysis</CardTitle>
              <CardDescription>
                Last 30 days of ETH transaction volume
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {chartData ? (
                <div className="w-full h-[500px] p-4">
                  <Line data={chartData} options={chartOptions} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                  {isLoading
                    ? "Loading chart..."
                    : "Enter an address and click Analyze to view transaction history"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Analytics;
