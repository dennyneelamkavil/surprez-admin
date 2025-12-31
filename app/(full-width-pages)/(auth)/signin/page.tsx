import { Metadata } from "next";
import SignInForm from "./components/SignInForm";

export const metadata: Metadata = {
  title: "Sign In | Surprez Admin",
  description: "Sign in to access the Surprez admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignIn() {
  return <SignInForm />;
}
