import React from "react";
import { Loading as LoadingComponent } from "~/components/ui/loading";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <LoadingComponent />
    </div>
  );
}
