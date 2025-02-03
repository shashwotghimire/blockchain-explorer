import React, { useEffect, useState } from "react";
import { Terminal } from "lucide-react"; // Add this import at the top with other imports

import { auth } from "../../firebase/firebase-config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// import AddressModal from "@/components/ui/AddressModal";
// import Navbar from "@/components/ui/Navbar";
import CustomSidebar from "@/components/ui/CustomSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import {
  getAccountBalance,
  getTransactionHistory,
  getTokenBalance,
  getGasEstimations,
} from "../../blockchain.js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// import { CustomSidebar } from "@/components/ui/CustomSidebar";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function Dashboard() {
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]); // Store all fetched transactions
  const [displayedTransactions, setDisplayedTransactions] = useState([]); // Initialize displayedTransactions as an empty array
  const [tokenBalance, setTokenBalance] = useState({});
  const [gasEstimation, setGasEstimation] = useState(null);

  const [page, setPage] = useState(1); // Track the current page for pagination
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(true);

  const navigate = useNavigate();

  const TRANSACTIONS_PER_PAGE = 10;

  const user = auth.currentUser;

  const TOKEN_NAMES = ["USDT", "USDC", "DAI"];

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/signin");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert from Unix timestamp (seconds)
    return date.toLocaleString(); // Convert to local date and time
  };

  const loadTransactions = async (pageNumber) => {
    if (!address) return; // Add this check
    setIsLoading(true);
    try {
      const userTransactionList = await getTransactionHistory(address);
      if (userTransactionList && Array.isArray(userTransactionList.result)) {
        setAllTransactions(userTransactionList.result);
        setTotalPages(
          Math.ceil(userTransactionList.result.length / TRANSACTIONS_PER_PAGE)
        );
        updateDisplayedTransactions(pageNumber, userTransactionList.result);
      } else {
        setError("Error fetching transaction history");
        setDisplayedTransactions([]); // Reset to empty array on error
      }
    } catch (error) {
      setError("Error fetching transaction history");
      setDisplayedTransactions([]); // Reset to empty array on error
    }
    setIsLoading(false);
  };

  const updateDisplayedTransactions = (pageNum, transactions) => {
    if (!Array.isArray(transactions)) {
      setDisplayedTransactions([]);
      return;
    }
    const startIndex = (pageNum - 1) * TRANSACTIONS_PER_PAGE;
    const endIndex = startIndex + TRANSACTIONS_PER_PAGE;
    setDisplayedTransactions(transactions.slice(startIndex, endIndex));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    updateDisplayedTransactions(newPage, allTransactions);
  };

  const handleEstimateGas = async () => {
    const fromAddress = "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae";
    const toAddress = "0x5e1eaa3d6d03ed4b5b1b378e837528ba8cd32f35";
    const value = "0x0";

    try {
      const gas = await getGasEstimations(fromAddress, toAddress, value);
      if (gas && gas.result) {
        setGasEstimation(parseInt(gas.result, 16));
      } else {
        setError("error estimating gas");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show before and after current page
    const range = [];
    const rangeWithDots = [];

    // Always include page 1
    range.push(1);

    for (let i = page - delta; i <= page + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // Always include last page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Add dots between ranges
    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return; // Only fetch when address is available

      try {
        // Reset states
        setBalance(null);
        setAllTransactions([]);
        setTokenBalance({});
        setError("");

        // Fetch balance
        const userBalance = await getAccountBalance(address);
        if (userBalance && userBalance.result) {
          setBalance(userBalance.result);
        } else {
          setError("Error fetching balance");
        }

        // Fetch token balances
        const fetchedTokenBalances = {};
        for (const token of TOKEN_NAMES) {
          const tokenData = await getTokenBalance(address, token);
          if (tokenData && tokenData.result) {
            const tokenDecimals = token === "DAI" ? 18 : 6;
            fetchedTokenBalances[token] = tokenData.result;
          }
        }
        setTokenBalance(fetchedTokenBalances);

        // Load first page of transactions
        setPage(1);
        await loadTransactions(1);
      } catch (error) {
        setError("Error fetching data");
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, address]); // Add address as dependency

  // Update the AddressModal submission handler
  const handleAddressSubmit = (newAddress) => {
    setAddress(newAddress);
    setIsModalOpen(false);
  };

  return (
    <SidebarProvider>
      <CustomSidebar />
      <div className={`flex-1 min-h-screen bg-background p-8 `}>
        {/* <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddressSubmit} // Use the new handler
      /> */}

        <div className={`space-y-6 max-w-6xl mx-auto }`}>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
          <Alert className="p-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle className="text-xl mb-4">
              Search an Ethereum address:
            </AlertTitle>
            <AlertDescription>
              <Input
                type="text"
                placeholder="Enter Ethereum Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-12" // Adjusted height and removed extra padding
              />
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h3 className="font-semibold leading-none tracking-tight">
                Balance
              </h3>
              <p className="text-2xl font-bold mt-2">
                {(balance / 1e18).toFixed(4)} ETH
              </p>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h3 className="font-semibold leading-none tracking-tight">
                Gas Estimation
              </h3>
              <div className="mt-2 space-y-2">
                <Button onClick={handleEstimateGas} variant="outline">
                  Estimate Gas
                </Button>
                {gasEstimation !== null && (
                  <p className="text-2xl font-bold">{gasEstimation} units</p>
                )}
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h3 className="font-semibold leading-none tracking-tight">
                Token Balances
              </h3>
              <div className="mt-2 space-y-1">
                {Object.entries(tokenBalance).map(([token, balance]) => (
                  <div
                    key={token}
                    className="flex justify-between items-center"
                  >
                    <span className="font-medium">{token}:</span>
                    <span className="font-bold">{balance}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="font-semibold leading-none tracking-tight mb-4">
                Transaction History
              </h3>
              <Table>
                <TableCaption>A list of your recent transactions</TableCaption>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead className="font-semibold">
                      Transaction Hash
                    </TableHead>
                    <TableHead className="font-semibold">
                      Amount (ETH)
                    </TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">From</TableHead>
                    <TableHead className="font-semibold">To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(displayedTransactions) &&
                  displayedTransactions.length > 0 ? (
                    displayedTransactions.map((transaction, index) => (
                      <TableRow key={index} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-muted-foreground">
                          {transaction?.hash
                            ? `${transaction.hash.slice(
                                0,
                                10
                              )}...${transaction.hash.slice(-8)}`
                            : "N/A"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction?.value
                            ? (transaction.value / 1e18).toFixed(4)
                            : "0.0000"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {transaction?.timeStamp
                            ? formatDate(transaction.timeStamp)
                            : "N/A"}
                        </TableCell>
                        <TableCell className="font-mono text-muted-foreground">
                          {transaction?.from
                            ? `${transaction.from.slice(
                                0,
                                6
                              )}...${transaction.from.slice(-4)}`
                            : "N/A"}
                        </TableCell>
                        <TableCell className="font-mono text-muted-foreground">
                          {transaction?.to
                            ? `${transaction.to.slice(
                                0,
                                6
                              )}...${transaction.to.slice(-4)}`
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        {isLoading
                          ? "Loading transactions..."
                          : "No transactions found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="p-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 1 && handlePageChange(page - 1)}
                      disabled={page === 1}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((pageNum, i) => (
                    <PaginationItem key={i}>
                      {pageNum === "..." ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={page === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        page < totalPages && handlePageChange(page + 1)
                      }
                      disabled={page === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>

          {error && <p className="text-destructive font-medium">{error}</p>}
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Dashboard;
