"use client";

import { useState, useMemo, useEffect } from "react";
// import { placeholderTokens as originalPlaceholderTokens } from "../lib/placeholder-data";
import { placeholderTokens as originalPlaceholderTokens } from "../lib/placeholder-data";

import {
  TrendingUp,
  Zap,
  Star,
  Search,
  ArrowUpDown,
  Grid,
  List,
} from "lucide-react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Badge } from "./components/ui/badge";
import { Card, CardContent } from "./components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Link } from "react-router-dom";

import { cn } from "../lib/utils";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { useTokenExplorerQuery } from "../hooks/useTokenExplorerQuery";
import { useTokenDailyMetricsQuery } from "../hooks/useTokenDailyMetrics";

type SortOption = "price" | "marketCap" | "volume" | "holders" | "priceChange";
type ViewMode = "grid" | "list";

export default function ExplorePage() {
  const [filter, setFilter] = useState<"all" | "top" | "new" | "trending">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("marketCap");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Fixed items per page
  const [dataToken, setDataToken] = useState([]);

  // Pagination logic
  const totalPages = Math.ceil(dataToken.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTokens = dataToken.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const resetPagination = () => setCurrentPage(1);

  useEffect(() => {
    resetPagination();
  }, [filter, searchQuery, sortBy]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="w-full py-8 md:py-12 border-b border-border/40">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Category Tabs with Search */}
          <Tabs
            value={filter}
            onValueChange={(value) => setFilter(value as any)}
            className="w-full mb-8"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4">
              {/* Search Bar */}
              <div className="relative w-full lg:w-96 order-2 lg:order-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tokens, creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 rounded-full bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
                />
              </div>

              {/* Tab List and Controls */}
              <div className="flex items-center gap-4 order-1 lg:order-2">
                {/* Sort Controls */}
                <Select
                  value={sortBy}
                  onValueChange={(value: SortOption) => setSortBy(value)}
                >
                  <SelectTrigger className="w-40 h-11 rounded-full bg-card/50 backdrop-blur-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketCap">Market Cap</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="volume">Volume 24h</SelectItem>
                    <SelectItem value="holders">Holders</SelectItem>
                    <SelectItem value="priceChange">Price Change</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleSortOrder}
                  className="h-11 w-11 rounded-full bg-card/50 backdrop-blur-sm"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>

                {/* View Mode Toggle */}
                <div className="flex rounded-full bg-card/50 backdrop-blur-sm p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="h-9 w-9 rounded-full"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="h-9 w-9 rounded-full"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Tab List */}
                <TabsList className="grid grid-cols-4 bg-card/50 backdrop-blur-sm p-1 rounded-full">
                  <TabsTrigger
                    value="all"
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="trending"
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <TrendingUp className="mr-1 h-3 w-3" /> Trending
                  </TabsTrigger>
                  <TabsTrigger
                    value="new"
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Zap className="mr-1 h-3 w-3" /> New
                  </TabsTrigger>
                  <TabsTrigger
                    value="top"
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Star className="mr-1 h-3 w-3" /> Top
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
          </Tabs>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6 px-1">
            <p className="text-sm text-muted-foreground">
              Showing {dataToken.length} tokens
              {searchQuery && ` for "${searchQuery}"`}
            </p>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Live Data
            </Badge>
          </div>
        </div>
      </section>

      {/* Token Grid/List */}
      <section className="w-full py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {viewMode === "grid" ? (
            <TokenGrid tokens={paginatedTokens} setDataToken={setDataToken} />
          ) : (
            <TokenList tokens={paginatedTokens} setDataToken={setDataToken} />
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-8">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-full px-4"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {/* First page */}
                  {currentPage > 3 && totalPages > 5 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        className="w-10 h-10 rounded-full"
                      >
                        1
                      </Button>
                      {currentPage > 4 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                    </>
                  )}

                  {/* Page numbers around current page */}
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={cn(
                          "w-10 h-10 rounded-full",
                          currentPage === pageNum &&
                            "bg-primary text-primary-foreground"
                        )}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  {/* Last page */}
                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-10 h-10 rounded-full"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-full px-4"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function TokenGrid({
  tokens,
  setDataToken,
}: {
  tokens: any[];
  setDataToken: (value: any) => void;
}) {
  const { data, isLoading, isError } = useTokenExplorerQuery();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-2">Loading tokens...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-2">
          Error loading tokens
        </p>
      </div>
    );
  }

  // Use the passed tokens prop as fallback if data is null
  const tokensToDisplay = data?.tokensMap || tokens;

  if (tokensToDisplay.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-2">No tokens found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }
  setDataToken(tokensToDisplay);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tokensToDisplay.map((token: any) => (
        <EnhancedTokenCard key={token.pair} token={token} />
      ))}
    </div>
  );
}

function TokenList({
  tokens,
  setDataToken,
}: {
  tokens: any[];
  setDataToken: (value: any) => void;
}) {
  const { data, isLoading, isError } = useTokenExplorerQuery();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-2">Loading tokens...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-2">
          Error loading tokens
        </p>
      </div>
    );
  }

  // Use the passed tokens prop as fallback if data is null
  const tokensToDisplay = data?.tokensMap || tokens;

  if (tokensToDisplay.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-2">No tokens found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }
  setDataToken(tokensToDisplay);

  return (
    <div className="space-y-3">
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b border-border/40">
        <div className="col-span-4">Token</div>
        <div className="col-span-2 text-right">Price</div>
        {/* <div className="col-span-2 text-right">24h Change</div> */}
        {/* <div className="col-span-2 text-right">Volume</div> */}
        <div className="col-span-2 text-right">Market Cap</div>
      </div>
      {/* Token Rows */}

      {tokensToDisplay?.map((token: any) => (
        <TokenListItem key={token.pair} token={token} />
      ))}
    </div>
  );
}

function EnhancedTokenCard({ token }: { token: any }) {
  const isPositiveChange = token.priceChange24h >= 0;

  console.log(token.pair);
  return (
    <Link to={`/token/${token.pair}`} className="block group">
      <Card className="h-full overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={token.url || "/placeholder.svg"}
                alt={token.creatorName}
              />
              {/* <AvatarFallback>{token.tokenName.substring(0, 1)}</AvatarFallback> */}
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                {token.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {token.symbol}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Price</span>
              <span className="font-bold">${token.tokenPrice}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">24h Change</span>
              <span
                className={cn(
                  "font-medium text-sm",
                  isPositiveChange ? "text-green-500" : "text-red-500"
                )}
              >
                {isPositiveChange ? "+" : ""}
                {token.priceChange24h}%
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Volume</span>
              <span className="font-medium text-sm">
                ${token.volume24h / 1000}K
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Market Cap</span>
              <span className="font-medium text-sm">
                {/* ${token.marketCap / 1000000}M */}
              </span>
            </div>

            {/* <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Holders</span>
              <span className="font-medium text-sm">
                {token.holders.toLocaleString()}
              </span>
            </div> */}
          </div>

          {token.milestones && token.milestones.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {token.milestones.slice(0, 2).map((milestone: any) => (
                <Badge
                  key={milestone}
                  variant="secondary"
                  className="text-xs bg-primary/10 text-primary border-primary/20"
                >
                  {milestone}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function TokenListItem({ token }: { token: any }) {
  const isPositiveChange = token.priceChange24h >= 0;

  return (
    <Link to={`/token/${token.pair}`} className="block group">
      <Card className="hover:shadow-md transition-all duration-200 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Token Info */}
            <div className="md:col-span-4 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={token.url || "/placeholder.svg"}
                  alt={token.creatorName}
                />
                <AvatarFallback>{token.name}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                  {token.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {token.symbol} • {token.name}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="md:col-span-2 md:text-right">
              <p className="font-bold">${token.tokenPrice}</p>
            </div>

            {/* 24h Change */}
            <div className="md:col-span-2 md:text-right">
              <span
                className={cn(
                  "font-medium",
                  isPositiveChange ? "text-green-500" : "text-red-500"
                )}
              >
                {isPositiveChange ? "+" : ""}
                {token.priceChange24h}%
              </span>
            </div>

            {/* Volume */}
            <div className="md:col-span-2 md:text-right">
              <p className="font-medium">
                ${(token.volume24h / 1000).toFixed(1)}K
              </p>
            </div>

            {/* Market Cap */}
            <div className="md:col-span-2 md:text-right">
              <p className="font-medium">${token.marketCap / 1000000}M</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
