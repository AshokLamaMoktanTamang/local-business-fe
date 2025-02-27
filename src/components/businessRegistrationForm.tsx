import { useEffect, useRef, useState } from "react";
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
import { RichTextEditor } from "./editor";
import {
  useEditBusinessMutation,
  useGetBusinessByIdQuery,
  useRegisterBusinessMutation,
} from "@/store/service/businessApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FileUploader } from "./fileUploader";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const businessSchema = z.object({
  name: z.string().min(3, "Business name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  phone: z.number().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  description: z.string({ description: "Description is required" }),
  latitude: z.string(),
  longitude: z.string(),
  image: z.any(),
});

type BusinessFormData = z.infer<typeof businessSchema>;

export default function BusinessRegistrationForm() {
  const [searchParams] = useSearchParams();

  const businessId = searchParams.get("business");
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const { data: business } = useGetBusinessByIdQuery(
    { id: businessId || "" },
    { skip: !businessId }
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      latitude: "27.69327440105422",
      longitude: "85.28153697270993",
    },
  });
  const [registerBusiness, { isLoading }] = useRegisterBusinessMutation();
  const [updateBusiness, { isLoading: updating }] = useEditBusinessMutation();

  const [loading, setLoading] = useState(false);
  const lat = parseFloat(watch("latitude"));
  const lon = parseFloat(watch("longitude"));

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

  function LocationMarker() {
    useMapEvents({
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

  const onSubmit = (data: BusinessFormData) => {
    if (businessId) {
      updateBusiness({ id: businessId, data })
        .unwrap()
        .then(() => {
          navigate("/business/my-businesses");
        });
    } else {
      registerBusiness(data)
        .unwrap()
        .then(() => {
          navigate("/business/my-businesses");
        });
    }
  };

  useEffect(() => {
    if (!businessId || !business) return;

    const {
      address,
      location: { latitude, longitude },
      description,
      email,
      image,
      name,
      phone,
    } = business;
    reset({
      address,
      latitude,
      longitude,
      description,
      email,
      image,
      name,
      phone,
    });
  }, [businessId, business]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Register a Business</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Business Name</label>
          <Input {...register("name")} placeholder="Enter business name" />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Business Image</label>
          <FileUploader name="image" control={control} />
        </div>

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

        <div>
          <label className="block text-sm font-medium">Description</label>
          <RichTextEditor {...register("description")} control={control} />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Latitude</label>
            <Input type="text" {...register("latitude")} readOnly />
          </div>

          <div>
            <label className="block text-sm font-medium">Longitude</label>
            <Input type="text" {...register("longitude")} readOnly />
          </div>
        </div>

        <Button
          disabled={isLoading || updating}
          type="submit"
          className="w-full"
        >
          {businessId ? "Edit" : "Register"} Business
        </Button>
      </form>
    </div>
  );
}
