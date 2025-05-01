import { auth } from "@/lib/auth";
import { Button } from "../ui/button";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default function SignOutButton() {
  return (
    <Button
      variant="outline"
      className="w-full"
      formAction={async () => {
        "use server";
        await auth.api.signOut({
          headers: await headers(),
        });
        redirect("/auth/signin");
      }}
    >
      Sign out
    </Button>
  );
}
