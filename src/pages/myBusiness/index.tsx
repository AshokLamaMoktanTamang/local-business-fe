import config from "@/config";
import useAuth from "@/hooks/useAuth";
import { useGetBusinessQuery } from "@/store/service/businessApi";
import { Loader } from "lucide-react";

const MyBusiness = () => {
  const { user } = useAuth();
  const { data, isLoading } = useGetBusinessQuery(
    { owner: user?.id || "" },
    { skip: !user?.id }
  );

  if (isLoading) return <Loader className="animate-spin mx-auto" />;

  return (
    <div className="p-6 space-y-8">
      <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        My Businesses
      </h3>
      {data?.map(
        ({
          image,
          _id,
          name,
          description,
          address,
          phone,
          email,
          isVerified,
        }) => (
          <div
            key={_id}
            className="flex items-center p-6 shadow-lg rounded-xl space-x-6 border border-gray-200 hover:shadow-xl transform transition duration-300 hover:scale-105"
          >
            <div className="relative w-48 h-48 flex-shrink-0">
              <img
                src={config.assetBaseUrl + image}
                alt={name}
                className="w-full h-full object-cover rounded-xl shadow-md transition-all duration-300 hover:opacity-80"
              />
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black to-transparent rounded-xl"></div>
            </div>
            <div className="flex flex-col space-y-3 w-full">
              <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
              <p
                className="text-gray-600 text-sm line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              ></p>
              <div className="space-y-1 text-gray-600">
                <p className="text-sm">
                  <strong>Address:</strong> {address}
                </p>
                <p className="text-sm">
                  <strong>Phone:</strong> {phone}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {email}
                </p>
              </div>
              <p
                className={`text-sm font-semibold ${
                  isVerified ? "text-green-500" : "text-red-500"
                }`}
              >
                {isVerified ? "Verified" : "Not Verified"}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default MyBusiness;
