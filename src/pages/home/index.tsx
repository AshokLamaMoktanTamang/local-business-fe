import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome to Our App
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Build amazing experiences with ShadCN and TailwindCSS.
        </p>
        <Button className="mt-4">Get Started</Button>
      </motion.div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {["Feature 1", "Feature 2", "Feature 3"].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
          >
            <Card className="w-64 p-4 text-center">
              <CardContent>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {feature}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  This is an amazing feature.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
