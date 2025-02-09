import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const businessSchema = z.object({
  name: z.string().min(3, "Business name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  latitude: z.string(),
  longitude: z.string(),
});

type BusinessFormData = z.infer<typeof businessSchema>;

export default function BusinessRegistrationForm() {
  const mapRef = useRef<L.Map | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      latitude: "27.69327440105422",
      longitude: "85.28153697270993",
    },
  });

  const [loading, setLoading] = useState(false);
  const lat = parseFloat(watch("latitude"));
  const lon = parseFloat(watch("longitude"));

  // Function to fetch coordinates from an address
  const fetchCoordinates = async (address: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: { q: address, format: "json", limit: 1 },
        }
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setValue("latitude", lat);
        setValue("longitude", lon);
        mapRef.current?.flyTo([lat, lon], 15, { animate: true });
      } else {
        alert("Coordinates not found for this address.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      alert("Failed to fetch coordinates.");
    } finally {
      setLoading(false);
    }
  };

  // Component to handle dragging the map marker
  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setValue("latitude", e.latlng.lat.toString());
        setValue("longitude", e.latlng.lng.toString());
      },
    });

    return lat && lon ? (
      <Marker
        position={[lat, lon]}
        icon={customIcon}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const newLatLng = e.target.getLatLng();
            setValue("latitude", newLatLng.lat.toString());
            setValue("longitude", newLatLng.lng.toString());
          },
        }}
      />
    ) : null;
  }

  // Handle Form Submission
  const onSubmit = (data: BusinessFormData) => {
    console.log("Business Registered:", data);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Register a Business</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium">Business Name</label>
          <Input {...register("name")} placeholder="Enter business name" />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <Input
            type="email"
            {...register("email")}
            placeholder="Enter email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <Input
            type="tel"
            {...register("phone")}
            placeholder="Enter phone number"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* Address with Auto-Fill Button */}
        <div>
          <label className="block text-sm font-medium">Address</label>
          <div className="flex gap-2">
            <Textarea
              {...register("address")}
              placeholder="Enter business address"
            />
            <Button
              type="button"
              onClick={() => fetchCoordinates(watch("address"))}
              disabled={loading}
            >
              {loading ? "Fetching..." : "Get Location"}
            </Button>
          </div>
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        {/* Interactive Map */}
        <div>
          <label className="block text-sm font-medium">Location</label>
          <MapContainer
            center={[lat, lon]}
            zoom={13}
            className="h-60 w-full rounded-md"
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <LocationMarker />
          </MapContainer>
        </div>

        {/* Latitude */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Latitude</label>
            <Input type="text" {...register("latitude")} readOnly />
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-sm font-medium">Longitude</label>
            <Input type="text" {...register("longitude")} readOnly />
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Register Business
        </Button>
      </form>
    </div>
  );
}
