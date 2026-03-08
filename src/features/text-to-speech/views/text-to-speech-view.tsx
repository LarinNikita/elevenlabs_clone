import { TextInputPanel } from "@/features/text-to-speech/components/text-input-panel";

export function TextToSpeechView() {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col">
        <TextInputPanel />
      </div>
    </div>
  );
}
