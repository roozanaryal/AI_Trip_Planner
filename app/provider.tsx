import React, { useEffect } from "react";
import Header from "./_components/Header";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const CreateUser = useMutation(api.user.createNewUser);

  useEffect(() => {
    if (!user) return;
    const run = async () => {
      await CreateUser({
        name: user.firstName ?? "",
        email: user.emailAddresses[0]?.emailAddress ?? "",
        imageUrl: user.imageUrl ?? "",
        // subscription: user.subscription,
      });
    };
    void run();
  }, [user, CreateUser]);
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default Provider;
