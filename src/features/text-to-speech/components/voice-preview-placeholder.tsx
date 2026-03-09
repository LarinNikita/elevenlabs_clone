import {
  AudioLinesIcon,
  BookOpenIcon,
  SparklesIcon,
  Volume2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function VoicePreviewPlaceholder() {
  return (
    <div className="hidden flex-1 lg:flex h-full flex-col items-center justify-center gap-6 border-t">
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex w-32 items-center justify-center">
          <div className="absolute left-0 -rotate-30 rounded-full bg-muted p-4">
            <Volume2Icon className="size-5 text-muted-foreground" />
          </div>
          <div className="relative z-10 rounded-full bg-foreground p-4">
            <SparklesIcon className="size-5 text-background" />
          </div>
          <div className="absolute right-0 -rotate-30 rounded-full bg-muted p-4">
            <AudioLinesIcon className="size-5 text-muted-foreground" />
          </div>
        </div>
        <p className="text-lg font-semibold tracking-tight text-foreground">
          Preview will appear here
        </p>
        <p className="max-w-64 text-center text-sm text-muted-foreground">
          Once your generate, your audio result will appear here. Sit back and
          relax.
        </p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href="/docs">
          <BookOpenIcon />
          Don&apos;t know how?
        </Link>
      </Button>
    </div>
  );
}
