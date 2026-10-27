import * as React from "react";

export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full flex-1">
      {children}
    </div>
  );
}
