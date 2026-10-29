"use client";

import * as React from "react";
import { User } from "@/lib/types";

export interface PortalUserContextValue {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refreshUser: () => Promise<User | null>;
}

export const PortalUserContext = React.createContext<PortalUserContextValue>({
  user: null,
  setUser: () => undefined,
  refreshUser: async () => null,
});

export function usePortalUser(): PortalUserContextValue {
  return React.useContext(PortalUserContext);
}
