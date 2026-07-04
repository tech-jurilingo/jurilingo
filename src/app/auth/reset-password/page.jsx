import { Suspense } from "react";
import ResetPassword from "@/components/resetpassword";

export const metadata = {
  title: "Reset Password | JuriLingo",
  description: "Set a new password for your JuriLingo account",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F5F5F0]">
        <div className="text-center font-medium text-gray-600">
          Loading reset screen...
        </div>
      </div>
    }>
      <ResetPassword />
    </Suspense>
  );
}
