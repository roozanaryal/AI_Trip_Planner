import React from "react";

function CreateNewTripLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
    </div>
  );
}

export default CreateNewTripLayout;
