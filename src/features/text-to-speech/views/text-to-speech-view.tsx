"use client";

import { SettingsPanel } from "@/features/text-to-speech/components/settings-panel";
import { TextInputPanel } from "@/features/text-to-speech/components/text-input-panel";
import {
  defaultTTSValues,
  TextToSpeechForm,
} from "@/features/text-to-speech/components/text-to-speech-form";
import { VoicePreviewPlaceholder } from "@/features/text-to-speech/components/voice-preview-placeholder";

export function TextToSpeechView() {
  return (
    <TextToSpeechForm defaultValues={defaultTTSValues}>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col">
          <TextInputPanel />
          <VoicePreviewPlaceholder />
        </div>
        <SettingsPanel />
      </div>
    </TextToSpeechForm>
  );
}
