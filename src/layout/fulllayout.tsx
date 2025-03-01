import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2, Search, User } from "lucide-react";
import { SignInModal } from "@/components/signinModal";
import useAuth from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Outlet, useNavigate } from "react-router-dom";
import { USER_ROLE } from "@/store/service/authApi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import config from "@/config";
import { useListVerifiedBusinessQuery } from "@/store/service/businessApi";

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { isLoggedIn, user, handleLogout } = useAuth();
  const { data, isLoading } = useListVerifiedBusinessQuery();

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Navbar */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full bg-white dark:bg-gray-800 shadow-md px-8 py-4 flex justify-between items-center"
        >
          {/* Logo */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Local Business
          </h1>

          {/* Search Bar */}
          <div className="relative w-full max-w-lg mx-6">
            <input
              type="text"
              placeholder="Search businesses..."
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-3 top-2 text-gray-500 dark:text-gray-300">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <Button
                onClick={() => setIsSignInOpen(true)}
                variant="outline"
                size="sm"
              >
                Sign In
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full transition hover:bg-gray-300 dark:hover:bg-gray-600">
                    <User className="w-5 h-5 text-gray-900 dark:text-white" />
                    <span className="hidden md:inline text-gray-900 dark:text-white font-medium">
                      {user?.username}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-lg shadow-lg"
                >
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  {user?.role === USER_ROLE.ADMIN ? (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      Admin Panel
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => navigate("/business")}>
                      Business Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </motion.nav>

        {/* Hero Carousel */}
        {!searchQuery.length && (
          <Carousel className="w-full h-[400px] mx-auto shadow-lg">
            <CarouselContent>
              {data?.slice(0, 5).map((business) => (
                <CarouselItem key={business._id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-xl"
                  >
                    {/* Business Image */}
                    <img
                      src={config.assetBaseUrl + business.image}
                      alt={business.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80 flex flex-col justify-end p-6 text-white">
                      <h3 className="text-2xl font-bold">{business.name}</h3>
                      <p className="text-lg opacity-80">{business.address}</p>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children ?? <Outlet context={{ searchQuery }} />}
        </main>

        {/* Footer */}
        <footer className="text-center py-6 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm">
          © {new Date().getFullYear()} Local Business. All rights reserved.
        </footer>
      </div>

      <SignInModal open={isSignInOpen} setOpen={setIsSignInOpen} />
    </>
  );
}
