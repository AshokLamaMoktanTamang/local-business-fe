import { motion } from "framer-motion";
import { Search, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Command } from "@/components/ui/command";
import { CSSProperties, useState } from "react";
import { Input } from "@/components/ui/input";

const businesses = [
  {
    name: "Joe's Coffee",
    description: "Best coffee in town ☕",
    category: "Café",
    rating: 4.8,
    location: "Downtown",
  },
  {
    name: "FitLife Gym",
    description: "Your fitness journey starts here 💪",
    category: "Gym",
    rating: 4.6,
    location: "East Side",
  },
  {
    name: "Tech Repair Hub",
    description: "Quick & reliable tech repairs 🔧",
    category: "Tech",
    rating: 4.7,
    location: "City Center",
  },
];

export default function Home() {
  const [search, setSearch] = useState<string>();

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Discover & Support Local Businesses
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300 text-lg">
          Find the best businesses in your area and support your local
          community.
        </p>
        <Button className="mt-5 px-6 py-3 text-lg rounded-lg">
          Get Started
        </Button>
      </motion.div>

      {/* Search Bar with Filters */}
      <div className="relative w-full max-w-lg mt-8">
        <Command className="w-full bg-white dark:bg-gray-800 shadow-xl rounded-lg">
          <div className="flex items-center p-3">
            <Search className="w-5 h-5 text-gray-500 mr-3" />
            <Input
              placeholder="Search businesses..."
              value={search || ""}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="border-0 flex-1 px-4 py-2 text-lg focus-visible:outline-0 focus-visible:shadow-none"
              style={{ "--tw-ring-shadow": "none" } as CSSProperties}
            />
          </div>
        </Command>
      </div>

      {/* Featured Businesses */}
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {businesses.map((business, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
          >
            <Card className="w-80 bg-white dark:bg-gray-800 shadow-xl rounded-lg hover:scale-[1.03] transition-all">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {business.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {business.description}
                </p>
                <div className="flex items-center mt-3 space-x-2">
                  <Badge variant="outline">{business.category}</Badge>
                  <span className="text-sm flex items-center text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" /> {business.location}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center p-6 border-t dark:border-gray-700">
                <div className="flex items-center text-yellow-500">
                  <Star className="w-5 h-5" />
                  <span className="ml-1 font-medium text-lg">
                    {business.rating}
                  </span>
                </div>
                <Button variant="outline">View</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
