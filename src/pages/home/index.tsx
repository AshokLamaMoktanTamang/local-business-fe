import { useListVerifiedBusinessQuery } from "@/store/service/businessApi";
import { Loader2, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import config from "@/config";
import { motion } from "framer-motion";
import { useNavigate, useOutletContext } from "react-router-dom";

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="bg-yellow-300">
        {part}
      </span>
    ) : (
      part
    )
  );
};

export default function Home() {
  const navigate = useNavigate();
  const { data, isLoading } = useListVerifiedBusinessQuery();
  const { searchQuery } = useOutletContext<any>();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );

  const filteredBusinesses = data?.filter(
    (business) =>
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-8">
      {/* Hero Section */}
      {!searchQuery.length && (
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
            Discover Local Businesses
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Find trusted businesses near you with ease.
          </p>
        </div>
      )}

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {filteredBusinesses?.map((business) => (
          <motion.div
            key={business._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate(`/${business._id}`)}
          >
            <Card className="hover:shadow-2xl transition-all rounded-lg overflow-hidden">
              <CardHeader className="p-0">
                <img
                  src={config.assetBaseUrl + business.image}
                  alt={business.name}
                  className="w-full h-44 object-cover"
                />
              </CardHeader>
              <CardContent className="p-5">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  {highlightText(business.name, searchQuery)}
                </CardTitle>
                <p
                  className="text-gray-600 dark:text-gray-400 text-sm mt-2"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(
                      business.description,
                      searchQuery
                    ).toString(),
                  }}
                ></p>
                <div className="flex items-center mt-3 text-gray-700 dark:text-gray-300">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{highlightText(business.address, searchQuery)}</span>
                </div>
                <div className="flex items-center mt-1 text-gray-700 dark:text-gray-300">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>{business.phone}</span>
                </div>
                <Button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 rounded-lg shadow-md">
                  View Details
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
