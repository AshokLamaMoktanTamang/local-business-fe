import { useGetBusinessDetailQuery } from "@/store/service/businessApi";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import config from "@/config";
import AddCommentForm from "@/components/addCommentForm";
import { useListBusinessCommentsQuery } from "@/store/service/commentApi";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import useAuth from "@/hooks/useAuth";

const BusinessDetail = () => {
  const { businessId = "" } = useParams();
  const { data: business, isLoading } = useGetBusinessDetailQuery({
    id: businessId,
  });

  const { user, isLoading: userLoading } = useAuth();
  const { data: comments, isLoading: commentLoading } =
    useListBusinessCommentsQuery({ business: businessId });

  if (isLoading || !business || commentLoading || userLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );

  return (
    <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {business.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={config.assetBaseUrl + business.image}
                alt={business.name}
                className="w-full md:w-1/3 rounded-lg object-cover shadow-md"
              />
              <div className="flex-1 space-y-3">
                <p
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: business.description }}
                ></p>
                <p className="text-gray-600">📍 {business.address}</p>
                <p className="text-gray-600">📞 {business.phone}</p>
                <p className="text-gray-600">✉️ {business.email}</p>
                {user && <Button variant={"default"}>Contact Owner</Button>}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <MapContainer
              center={[business.location.latitude, business.location.longitude]}
              zoom={15}
              className="h-64 w-full rounded-lg shadow-md"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={[
                  business.location.latitude,
                  business.location.longitude,
                ]}
              >
                <Popup>{business.name}</Popup>
              </Marker>
            </MapContainer>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {!comments?.length && !commentLoading && (
                <div className="text-gray-500 text-center italic">
                  No comments yet. Be the first to share your thoughts!
                </div>
              )}
              {comments?.map((comment) => (
                <div
                  key={comment._id}
                  className="flex gap-3 border-b pb-4 last:border-none"
                >
                  <Avatar className="w-[40px] h-[40px] flex justify-center items-center rounded-[50%] overflow-hidden bg-gray-100">
                    {/* <AvatarImage
                      src="https://robohash.org/9e3f14d88ea3c9f7f6b46dee0fd8eab2?set=set4&bgset=&size=400x400"
                      alt="User Avatar"
                    /> */}
                    <AvatarFallback>
                      {comment.userId.username.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-900">
                        {comment.userId.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p
                      className="text-gray-700 mt-1"
                      dangerouslySetInnerHTML={{ __html: comment.content }}
                    ></p>
                  </div>
                </div>
              ))}
            </div>
            {user && (
              <div className="mt-6">
                <AddCommentForm businessId={businessId} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessDetail;
