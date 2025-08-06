import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import type { CreatorToken } from "../../lib/placeholder-data";
import { cn } from "../../lib/utils";

interface CreatorTokenCardProps {
  token: CreatorToken;
}

export function CreatorTokenCard({ token }: CreatorTokenCardProps) {
  const isPositiveChange = token.priceChange24h >= 0;

  return (
    <Link to={`/token/${token.id}`} className="block group">
      <Card className="h-full overflow-hidden rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center gap-3 p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={token.creatorAvatar || "/placeholder.svg"}
              alt={token.creatorName}
            />
            <AvatarFallback>{token.creatorName.substring(0, 1)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
              {token.tokenName} ({token.tokenTicker})
            </CardTitle>
            <p className="text-xs text-muted-foreground">{token.creatorName}</p>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex justify-between items-baseline mb-2">
            <p className="text-2xl font-bold">${token.price.toFixed(2)}</p>
            <div
              className={cn(
                "flex items-center text-sm font-medium",
                isPositiveChange ? "text-green-500" : "text-red-500"
              )}
            >
              {isPositiveChange ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {token.priceChange24h.toFixed(2)}%
            </div>
          </div>
          <p className="text-xs text-muted-foreground truncate h-10">
            {token.bio}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          {token.milestones && token.milestones.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {token.milestones.slice(0, 2).map((milestone: string) => (
                <Badge
                  key={milestone}
                  variant="secondary"
                  className="text-xs bg-primary/10 text-primary border-primary/20"
                >
                  <TrendingUp className="h-3 w-3 mr-1" /> {milestone}
                </Badge>
              ))}
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
