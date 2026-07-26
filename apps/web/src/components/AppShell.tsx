import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu } from "lucide-react";

function NavItem({
  to,
  children,
  end,
}: {
  to: string;
  children: React.ReactNode;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
        )
      }
    >
      {children}
    </NavLink>
  );
}

function MenuLink({
  to,
  title,
  description,
}: {
  to: string;
  title: string;
  description?: string;
}) {
  return (
    <NavigationMenuLink asChild>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors",
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            isActive ? "bg-accent text-accent-foreground" : ""
          )
        }
      >
        <div className="text-sm font-medium">{title}</div>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </NavLink>
    </NavigationMenuLink>
  );
}

export function AppShell() {
  const { state, logout } = useAuth();

  const displayName =
    state.status === "authed"
      ? state.user?.name ?? state.user?.email ?? "User"
      : "Guest";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex w-full items-center justify-between px-4 py-3 lg:w-4/5 lg:px-0">
          {/* Left: brand + nav */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <NavLink to="/dashboard" aria-label="NextRep dashboard" className="shrink-0">
              <img src="/nextrep-logo.png" alt="NextRep" className="h-9 w-auto" />
            </NavLink>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open navigation"
                >
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 md:hidden">
                <DropdownMenuLabel>Navigate</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/journals">Journal entries</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/journals/create">Create journal entry</NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/gallery">Gallery</NavLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavItem to="/dashboard" end>
                    Dashboard
                  </NavItem>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Journals</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[360px] gap-2 p-2">
                      <MenuLink
                        to="/journals/create"
                        title="Create"
                        description="Log weight, steps, calories, notes."
                      />
                      <MenuLink
                        to="/journals"
                        title="View all"
                        description="Browse and edit your journal entries."
                      />
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavItem to="/gallery">Gallery</NavItem>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: auth */}
          <div className="flex items-center gap-3">
            {state.status !== "authed" ? (
              <Button asChild variant="secondary" size="sm">
                <NavLink to="/login">Login</NavLink>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-2 rounded-full px-2 py-1",
                      "hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{initials || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium sm:inline">
                      {displayName}
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <Separator />
      </header>

      <main className="mx-auto w-full px-4 py-6 lg:w-4/5 lg:px-0">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
      </main>

    </div>
  );
}
