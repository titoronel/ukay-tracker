"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      theme="system"
      toastOptions={{
        classNames: {
          toast: "bg-card border border-border shadow-lg rounded-lg",
          description: "text-muted-foreground",
          actionButton: "bg-muted text-foreground hover:bg-muted/80",
          cancelButton: "bg-muted text-foreground hover:bg-muted/80",
        },
      }}
    />
  );
}