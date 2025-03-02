import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useSignInMutation, useSignUpMutation } from "@/store/service/authApi";
import { toast } from "react-toastify";

export const SignInModal: FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // RTK Query hooks
  const [signIn, { isLoading: isSignInLoading }] = useSignInMutation();
  const [signUp, { isLoading: isSignUpLoading }] = useSignUpMutation();

  // Handle form data changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignIn) {
      signIn({
        email: formData.email,
        password: formData.password,
      })
        .unwrap()
        .then(({ token }) => {
          localStorage.setItem("token", token);
          setOpen(false);
        });
    } else {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      signUp({
        username: formData.name,
        email: formData.email,
        password: formData.password,
      })
        .unwrap()
        .then((data) => {
          console.log(data);
          debugger;

          toast.success("Signed up successfully! verify from your email");
          setOpen(false);
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="z-[999] max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isSignIn ? "Sign In" : "Sign Up"}
          </DialogTitle>
          <DialogDescription>
            {isSignIn
              ? "Enter your credentials to continue"
              : "Create an account to get started"}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name Field (Only for Sign-Up) */}
          {!isSignIn && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password (Only for Sign-Up) */}
          {!isSignIn && (
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <Button
            className="w-full"
            type="submit"
            disabled={isSignIn ? isSignInLoading : isSignUpLoading}
          >
            {isSignIn
              ? isSignInLoading
                ? "Signing In..."
                : "Sign In"
              : isSignUpLoading
              ? "Signing Up..."
              : "Sign Up"}
          </Button>
        </form>

        {/* Toggle between Sign In & Sign Up */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          {isSignIn ? (
            <>
              Don't have an account?{" "}
              <button
                className="text-blue-600 dark:text-blue-400 hover:underline"
                onClick={() => setIsSignIn(false)}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="text-blue-600 dark:text-blue-400 hover:underline"
                onClick={() => setIsSignIn(true)}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
