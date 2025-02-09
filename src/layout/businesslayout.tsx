import { Outlet, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FC, PropsWithChildren } from "react";
import useAuth from "@/hooks/useAuth";
import { USER_ROLE } from "@/store/service/authApi";
import RegisterBusiness from "@/components/businessRegistrationForm";

const BusinessLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== USER_ROLE.BUSINESS) return <RegisterBusiness />;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-semibold mb-4">Business Dashboard</h2>
        <nav className="space-y-2">
          <Link to="/business">
            <Button variant="ghost" className="w-full justify-start">
              Dashboard
            </Button>
          </Link>
          <Link to="/business/register">
            <Button variant="ghost" className="w-full justify-start">
              Register Business
            </Button>
          </Link>
          <Link to="/business/my-businesses">
            <Button variant="ghost" className="w-full justify-start">
              My Businesses
            </Button>
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4">
          <h2 className="text-lg font-semibold">Business Portal</h2>
        </header>

        <main className="flex-1 p-6 bg-gray-100">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
};

export default BusinessLayout;
