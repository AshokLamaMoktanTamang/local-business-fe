import { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  HomeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { USER_ROLE } from "@/store/service/authApi";

// const Sidebar = () => {
//   return (
//     <aside className="w-64 bg-gray-900 text-white h-screen p-4 space-y-6">
//       <h2 className="text-xl font-bold">Admin Panel</h2>
//       <nav className="space-y-2">
//         <Button variant="ghost" className="w-full justify-start">
//           <LayoutDashboard className="mr-2 h-5 w-5" /> Businesses
//         </Button>
//         <Button variant="ghost" className="w-full justify-start">
//           <Users className="mr-2 h-5 w-5" /> Users
//         </Button>
//         <Button variant="ghost" className="w-full justify-start">
//           <Settings className="mr-2 h-5 w-5" /> Settings
//         </Button>
//       </nav>
//     </aside>
//   );
// };

const Navbar = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  return (
    <header className="flex justify-between items-center bg-gray-100 px-6 py-3 border-b">
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage
              src="https://robohash.org/9e3f14d88ea3c9f7f6b46dee0fd8eab2?set=set4&bgset=&size=400x400"
              alt="Admin"
            />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate("/")}>
            <HomeIcon className="mr-2 h-4 w-4" /> Home
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

const AdminLayout = ({ children }: { children?: ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (!isLoading && (!user || user.role !== USER_ROLE.ADMIN))
    return <Navigate to="/" replace />;

  return (
    <div className="flex h-screen">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <h2 className="my-2 mx-2 text-2xl font-bold tracking-wide mb-6">
          Here are the list of the unverified Business
        </h2>
        <main className="p-6">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
