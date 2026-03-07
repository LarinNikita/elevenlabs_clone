"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  return (
    <div>
      <Button onClick={() => toast.success("Button clicked!")}>Click me</Button>
    </div>
  );
}
