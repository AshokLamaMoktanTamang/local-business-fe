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
import { useListUnverifiedBusinessQuery } from "@/store/service/businessApi";
import { Loader, MoreVertical, Check, X, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const AdminBusiness = () => {
  const [businessActionData, setBusinessActionData] = useState<null | {
    name: string;
    id: string;
    isVerified: boolean;
  }>(null);

  const { data, isLoading } = useListUnverifiedBusinessQuery();
  // const [approveBusiness, { isLoading: approving }] =
  //   useApproveBusinessMutation();

  const handleBusinessAction = (
    action: "approve" | "disapprove",
    { id, name, isVerified }: { id: string; name: string; isVerified: boolean }
  ) => {
    setBusinessActionData({ id, name, isVerified });
  };

  const handleApproveBusiness = (id: string, approve: boolean) => {
    // approveBusiness({ id, isVerified: approve })
    //   .unwrap()
    //   .then(() => {
    //     setBusinessActionData(null);
    //     toast.success(
    //       approve ? "Business approved successfully!" : "Business disapproved!"
    //     );
    //   });
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
                      {!isVerified ? (
                        <DropdownMenuItem
                          onClick={() =>
                            handleBusinessAction("approve", {
                              id: _id,
                              name,
                              isVerified,
                            })
                          }
                        >
                          <Check className="w-4 h-4 mr-2 text-green-500" />{" "}
                          Approve
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() =>
                            handleBusinessAction("disapprove", {
                              id: _id,
                              name,
                              isVerified,
                            })
                          }
                          className="text-red-500"
                        >
                          <X className="w-4 h-4 mr-2" /> Disapprove
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p
                  className="text-gray-600 text-sm line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: description }}
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
                  {isVerified ? "Approved" : "Not Approved"}
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
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <DialogTitle className="text-xl font-bold text-yellow-600">
              Confirm Action
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="text-gray-600">
            Are you sure you want to{" "}
            {businessActionData?.isVerified ? "disapprove" : "approve"}
            <span className="font-semibold">{businessActionData?.name}</span>?
          </DialogDescription>

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setBusinessActionData(null)}
              // disabled={approving}
            >
              Cancel
            </Button>
            <Button
              variant={
                businessActionData?.isVerified ? "destructive" : "default"
              }
              onClick={() =>
                businessActionData?.id &&
                handleApproveBusiness(
                  businessActionData.id,
                  !businessActionData.isVerified
                )
              }
              // disabled={approving}
            >
              {businessActionData?.isVerified ? "Disapprove" : "Approve"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminBusiness;
