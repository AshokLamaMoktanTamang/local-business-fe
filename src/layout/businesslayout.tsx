import { Outlet, Link, Navigate } from "react-router-dom";
import { FC, PropsWithChildren } from "react";
import { Home, Briefcase, Building, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";
import { USER_ROLE } from "@/store/service/authApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BusinessLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (!isLoading && (!user || user.role !== USER_ROLE.USER))
    return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold tracking-wide mb-6">
          Business Panel
        </h2>
        <nav className="space-y-2">
          <SidebarLink to="/business" icon={<Home className="h-5 w-5" />}>
            Dashboard
          </SidebarLink>
          <SidebarLink
            to="/business/register"
            icon={<Briefcase className="h-5 w-5" />}
          >
            Register Business
          </SidebarLink>
          <SidebarLink
            to="/business/my-businesses"
            icon={<Building className="h-5 w-5" />}
          >
            My Businesses
          </SidebarLink>
        </nav>
        <div className="mt-auto">
          <SidebarLink to="/logout" icon={<LogOut className="h-5 w-5" />}>
            Logout
          </SidebarLink>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-lg px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Business Portal
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage src="/avatar.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-6 bg-gray-50 rounded-t-xl shadow-inner">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default BusinessLayout;

const SidebarLink = ({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: string;
}) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 p-3 rounded-md hover:bg-gray-800 transition"
    )}
  >
    {icon} <span className="text-sm font-medium">{children}</span>
  </Link>
);
