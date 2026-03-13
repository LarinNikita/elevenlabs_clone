import { useState } from "react";

import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";
import { SearchIcon, SparklesIcon, XIcon } from "lucide-react";

import { voicesSearchParams } from "../lib/params";

import { VoiceCreatorDialog } from "./voice-creator-dialog";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function VoicesToolbar() {
  const [query, setQuery] = useQueryState("query", voicesSearchParams.query);
  const [localQuery, setLocalQuery] = useState(query);

  const debouncedSetQuery = useDebouncedCallback(
    (value: string) => setQuery(value),
    300,
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl lg:text-2xl font-semibold tracking-tighter">
          All Libraries
        </h2>
        <p className="text-sm text-muted-foreground">
          Discover your voices, or make your own
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <InputGroup className="lg:max-w-sm">
            <InputGroupAddon align="inline-start">
              <SearchIcon className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search voices..."
              value={localQuery}
              onChange={(e) => {
                setLocalQuery(e.target.value);
                debouncedSetQuery(e.target.value);
              }}
            />
            {localQuery.length > 0 && (
              <InputGroupAddon
                align="inline-end"
                onClick={() => {
                  setLocalQuery("");
                  debouncedSetQuery("");
                }}
                className="cursor-pointer"
              >
                <XIcon className="size-4" />
              </InputGroupAddon>
            )}
          </InputGroup>

          <div className="ml-auto hidden lg:block">
            <VoiceCreatorDialog>
              <Button size="sm">
                <SparklesIcon />
                Custom voice
              </Button>
            </VoiceCreatorDialog>
          </div>
          <div className="lg:hidden">
            <VoiceCreatorDialog>
              <Button size="sm" className="w-full">
                <SparklesIcon />
                Custom voice
              </Button>
            </VoiceCreatorDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
