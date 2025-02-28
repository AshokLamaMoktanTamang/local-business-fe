import { useGetProfileQuery } from "@/store/service/authApi";

const useAuth = () => {
  const token = localStorage.getItem("token");
  const { data, isLoading, refetch } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return {
    user: data,
    isLoading,
    refetchUser: refetch,
    isLoggedIn: Boolean(data),
    handleLogout,
  };
};

export default useAuth;
