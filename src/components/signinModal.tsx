import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dispatch, FC, SetStateAction, useState } from "react";

export const SignInModal: FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-6">
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

        <form className="space-y-4">
          {/* Name Field (Only for Sign-Up) */}
          {!isSignIn && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
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
              required
            />
          </div>

          {/* Confirm Password (Only for Sign-Up) */}
          {!isSignIn && (
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <Button className="w-full" type="submit">
            {isSignIn ? "Sign In" : "Sign Up"}
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
