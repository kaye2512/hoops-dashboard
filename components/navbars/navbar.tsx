import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import StoreSwitcher from "../store-switcher";
import MainNav from "./main-nav";
import ThemeToggle from "../theme-toggle";

export default async function Navbar() {
  // check if user is connected
  const user = await getUser();
  // if not redirige vers le login
  if (!user) {
    redirect("/auth/signin");
  }

  const stores = await prisma.store.findMany({
    where: {
      userId: user.id,
    },
  });
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className={"ml-auto flex items-center space-x-4"}>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
