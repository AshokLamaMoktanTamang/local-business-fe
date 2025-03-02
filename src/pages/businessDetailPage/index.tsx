import { useGetBusinessDetailQuery } from "@/store/service/businessApi";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import config from "@/config";

const BusinessDetail = () => {
  const { businessId = "" } = useParams();
  const { data: business, isLoading } = useGetBusinessDetailQuery({
    id: businessId,
  });

  if (isLoading || !business)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );

  return (
    <div className="mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{business.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={config.assetBaseUrl + business.image}
                alt={business.name}
                className="w-full md:w-1/3 rounded-lg object-cover"
              />
              <div className="flex-1 space-y-2">
                <p
                  dangerouslySetInnerHTML={{ __html: business.description }}
                ></p>
                <p className="text-gray-600">📍 {business.address}</p>
                <p className="text-gray-600">📞 {business.phone}</p>
                <p className="text-gray-600">✉️ {business.email}</p>
                <Button>Contact Owner</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <MapContainer
              center={[business.location.latitude, business.location.longitude]}
              zoom={15}
              className="h-64 w-full rounded-lg"
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
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Comments & Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessDetail;
