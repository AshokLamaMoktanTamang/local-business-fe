import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import config from "@/config";
import useAuth from "@/hooks/useAuth";
import { useGetBusinessByIdQuery } from "@/store/service/businessApi";
import {
  useGetChatHeadOfBusinessQuery,
  useListBusinesschatsQuery,
} from "@/store/service/chatApi";
import { Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

const BusinessChat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { businessId = "" } = useParams();
  const { data, isLoading } = useGetChatHeadOfBusinessQuery(
    { businessId },
    { skip: !businessId }
  );
  const { user } = useAuth();

  const chatId = searchParams.get("chat");

  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [newMessage, setNewMessage] = useState("");
  const { data: business, isLoading: businessLoading } =
    useGetBusinessByIdQuery({ id: businessId }, { skip: !businessId });

  const { data: chats } = useListBusinesschatsQuery(
    { receiverId: chatId || "", businessId: businessId || "" },
    { skip: !businessId || !chatId }
  );

  useEffect(() => {
    if (!chats) return;
    const activeSender = data?.find(({ _id }) => _id === chatId);
    const messages = chats.map(({ senderId, message }) => ({
      sender:
        senderId === user?.id ? "You" : activeSender?.sender.username || "",
      text: message,
    }));
    setMessages(messages);
  }, [chats, user]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socket.emit("private message", {
        senderId: user?.id,
        receiverId: chatId,
        message: newMessage,
        businessId: businessId,
      });
      setMessages([...messages, { sender: "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  useEffect(() => {
    if (!user) return;

    socket.connect();
    socket.emit("register", user?.id);
    socket.on("private message", ({ senderId, message }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: senderId, text: message },
      ]);
    });

    return () => {
      socket.disconnect();
      socket.off("private message");
    };
  }, [user]);

  if (isLoading || businessLoading || !business)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Business Info */}
      <div className="flex items-center bg-white shadow rounded-xl border p-6 gap-6">
        <img
          src={config.assetBaseUrl + business.image}
          alt={business.name}
          className="w-24 h-24 object-cover rounded-xl shadow-md"
        />
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            {business.name}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-2">
            {business.description}
          </p>
          <p className="text-gray-500 text-sm">📍 {business.address}</p>
          <p className="text-gray-500 text-sm">📞 {business.phone}</p>
        </div>
      </div>

      {/* Chat List */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Conversations</h3>
        <ul className="space-y-3">
          {data?.map(({ sender: { email, username }, message, _id }) => (
            <li
              key={_id}
              className="flex items-center p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
              onClick={() =>
                navigate(`/business/my-businesses/${businessId}?chat=${_id}`)
              }
            >
              <Avatar>
                <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <h4 className="text-sm font-medium">{username}</h4>
                <p className="text-xs text-gray-500">{email}</p>
                <p className="text-xs text-gray-600 truncate">{message}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Messages */}
      {chatId && (
        <div className="bg-white shadow rounded-lg p-4 flex flex-col h-96">
          <div className="flex-1 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-xs ${
                  msg.sender === "You"
                    ? "ml-auto bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-md px-4 py-2"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button
              onClick={handleSendMessage}
              className="flex items-center gap-1"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessChat;
