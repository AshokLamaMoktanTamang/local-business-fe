import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import config from "@/config";
import useAuth from "@/hooks/useAuth";
import {
  useDeleteBusinessMutation,
  useGetBusinessQuery,
} from "@/store/service/businessApi";
import {
  Loader,
  MoreVertical,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyBusiness = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const [businessActionData, setBusinessActionData] = useState<null | {
    name: string;
    id: string;
  }>(null);

  const { data, isLoading } = useGetBusinessQuery(
    { owner: user?.id || "" },
    { skip: !user?.id }
  );
  const [deleteBusiness, { isLoading: deleting }] = useDeleteBusinessMutation();

  const handleBusinessAction = (
    action: "edit" | "delete",
    { id, name }: { id: string; name: string }
  ) => {
    if (action === "edit") {
      navigate(`/business/register?business=${id}`);
    } else {
      setBusinessActionData({ id, name });
    }
  };

  const handleDeleteBusiness = (id: string) => {
    deleteBusiness({ id })
      .unwrap()
      .then(() => {
        setBusinessActionData(null);
        toast.success("Business deleted sucessfully"!);
      });
  };

  if (isLoading) return <Loader className="animate-spin mx-auto" />;

  return (
    <>
      <div className="p-6 space-y-8">
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
              className="flex items-center p-6 shadow-lg rounded-xl space-x-6 border border-gray-200 hover:shadow-xl transform transition duration-300 hover:scale-105 relative"
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
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-800">{name}</h2>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-full hover:bg-gray-200">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          handleBusinessAction("edit", { id: _id, name })
                        }
                      >
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleBusinessAction("delete", { id: _id, name })
                        }
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

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

      <Dialog
        open={Boolean(businessActionData)}
        onOpenChange={() => setBusinessActionData(null)}
      >
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <DialogTitle className="text-xl font-bold text-red-600">
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{businessActionData?.name}</span>?
            <br />
            This action{" "}
            <span className="font-bold text-red-500">cannot be undone</span>.
            You will permanently lose all data related to this business.
          </DialogDescription>

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setBusinessActionData(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                businessActionData?.id &&
                handleDeleteBusiness(businessActionData?.id)
              }
              disabled={deleting}
            >
              Delete Permanently
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyBusiness;
