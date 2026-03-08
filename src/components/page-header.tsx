import Link from "next/link";
import { HeadphonesIcon, ThumbsUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface PageHeaderProps {
  title: string;
  className?: string;
}

export function PageHeader({ title, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b px-4 py-4",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="mailto:support@example.com">
            <ThumbsUpIcon />
            <span className="hidden lg:block">Feedback</span>
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="mailto:support@example.com">
            <HeadphonesIcon />
            <span className="hidden lg:block">Need help?</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
