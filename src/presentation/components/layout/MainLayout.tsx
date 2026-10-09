"use client";

import { ReactNode } from "react";
import { BranchGate } from "../branch/BranchGate";
import { BranchThemeSync } from "../branch/BranchThemeSync";
import { ChatWidget } from "../chat/ChatWidget";
import { MainFooter } from "./MainFooter";
import { MainHeader } from "./MainHeader";

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout - Full-screen web app layout
 * No scrolling on the main container, designed like a web app
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <BranchGate>
      {/* Keeps the racing accent in step with client-side navigation */}
      <BranchThemeSync />

      <div className="h-screen w-screen overflow-hidden flex flex-col bg-racing-bg">
        {/* Header */}
        <MainHeader />

        {/* Main Content Area - Takes remaining space */}
        <main className="flex-1 overflow-auto">{children}</main>

        {/* Footer */}
        <MainFooter />

        {/* Chat Widget - Floating, admin only (Feature Toggled) */}
        {process.env.NEXT_PUBLIC_ENABLE_CHAT_WIDGET === "true" && (
          <ChatWidget />
        )}
      </div>
    </BranchGate>
  );
}
