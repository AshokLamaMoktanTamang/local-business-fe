import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useState } from "react";
import { SignInModal } from "@/components/signinModal";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isLoggedIn = localStorage.getItem("token");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
        {/* Navbar */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex justify-between items-center"
        >
          {/* Logo */}
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Local Business Directory
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Button variant="ghost">Home</Button>
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">Contact</Button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {!isLoggedIn && (
              <Button
                onClick={() => setIsSignInOpen(true)}
                variant="outline"
                size="sm"
              >
                Sign In
              </Button>
            )}
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
          </div>
        </motion.nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-800 shadow-md px-6 py-4"
          >
            <Button variant="ghost" className="w-full">
              Home
            </Button>
            <Button variant="ghost" className="w-full">
              Features
            </Button>
            <Button variant="ghost" className="w-full">
              Pricing
            </Button>
            <Button variant="ghost" className="w-full">
              Contact
            </Button>
          </motion.div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>

        {/* Footer */}
        <footer className="text-center py-4 text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} MyApp. All rights reserved.
        </footer>
      </div>

      <SignInModal open={isSignInOpen} setOpen={setIsSignInOpen} />
    </>
  );
}
