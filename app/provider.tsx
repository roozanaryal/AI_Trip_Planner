import React, { useContext, useEffect, useState } from "react";
import Header from "./_components/Header";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userDetail, setUserDetail] = useState<any>(null);
  const { user } = useUser();
  const CreateUser = useMutation(api.user.createNewUser);

  useEffect(() => {
    if (!user) return;
    const run = async () => {
      const result = await CreateUser({
        name: user.firstName ?? "",
        email: user.emailAddresses[0]?.emailAddress ?? "",
        imageUrl: user.imageUrl ?? "",
        // subscription: user.subscription,
      });
      setUserDetail(result);
    };
    void run();
  }, [user, CreateUser]);
  
  return (
    <UserDetailContext.Provider value={userDetail}>
      <div>
        <Header />
        {children}
      </div>
    </UserDetailContext.Provider>
  );
}

export default Provider;

export const useUserDetail = () => {
  return useContext(UserDetailContext);
};
