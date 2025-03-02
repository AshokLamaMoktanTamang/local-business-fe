import { Button } from "@/components/ui/button";
import config from "@/config";
import useAuth from "@/hooks/useAuth";
import { useListVerifiedBusinessQuery } from "@/store/service/businessApi";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";

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

const ChatLayout = () => {
  const navigate = useNavigate();
  const { chatId = "" } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const { isLoggedIn } = useAuth();
  const { data, isLoading } = useListVerifiedBusinessQuery();

  if (!isLoggedIn) return <Navigate to={"/"} replace />;
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
  const activeBusiness = data?.find(({ _id }) => _id === chatId);

  if (!activeBusiness && chatId) return <Navigate to={"/chat"} replace />;

  return (
    <div className="flex h-screen">
        <Button className="absolute right-[30px] top-[30px]" variant={"outline"} onClick={() => navigate("/")}>
          Go To Home
        </Button>
      <div className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="font-semibold text-lg text-gray-900 mb-4">Chat Rooms</h2>
        <input
          type="text"
          placeholder="Search businesses..."
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <ul className="space-y-4">
          {filteredBusinesses?.map(({ name, address, image, _id }) => (
            <li
              key={name}
              className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/chat/${_id}`)}
            >
              <img
                src={config.assetBaseUrl + image}
                alt={name}
                className="w-16 h-16 object-cover rounded-full mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {highlightText(name, searchQuery)}
                </h3>
                <p className="text-sm text-gray-500">
                  {highlightText(address, searchQuery)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {chatId ? (
          <div className="h-full flex flex-col">
            <div className="flex gap-2 flex-row">
              <img
                src={config.assetBaseUrl + activeBusiness?.image}
                alt={activeBusiness?.name}
                className="w-16 h-16 object-cover rounded-full mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {activeBusiness?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {activeBusiness?.address}
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-white shadow rounded-lg p-4">
              <Outlet />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-md px-4 py-2"
                placeholder="Type a message..."
              />
              <Button>Send</Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex justify-center items-center flex-col text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19V6l-2 2m6-2l-2 2v13"
              />
            </svg>
            <p className="text-xl font-semibold text-gray-600">
              Please select a chat from the left
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Choose a business owner to start the conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
