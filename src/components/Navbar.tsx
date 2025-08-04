import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Wallet, User, LogOut, Settings, Briefcase, Home, Users } from "lucide-react";

interface NavbarProps {
  isConnected?: boolean;
  walletAddress?: string;
  onConnectWallet?: () => void;
  onDisconnect?: () => void;
}

export const Navbar = ({ 
  isConnected = false, 
  walletAddress, 
  onConnectWallet, 
  onDisconnect 
}: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 mr-8">
          <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Web3Careers
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                <div className="flex items-center space-x-1">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </div>
              </Link>
              <Link to="/jobs" className="text-sm font-medium transition-colors hover:text-primary">
                <div className="flex items-center space-x-1">
                  <Briefcase className="h-4 w-4" />
                  <span>Jobs</span>
                </div>
              </Link>
              <Link to="/network" className="text-sm font-medium transition-colors hover:text-primary">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Network</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Wallet Connection & User Menu */}
          <div className="flex items-center space-x-4">
            {!isConnected ? (
              <Button 
                variant="connect" 
                size="sm" 
                onClick={onConnectWallet}
                className="shadow-primary"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Wallet Address Display */}
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-md bg-gradient-card border border-primary/20">
                  <div className="h-2 w-2 bg-success rounded-full animate-pulse-glow"></div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {walletAddress ? formatAddress(walletAddress) : "Connected"}
                  </span>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">John Doe</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {walletAddress ? formatAddress(walletAddress) : "Web3 Developer"}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={onDisconnect}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};