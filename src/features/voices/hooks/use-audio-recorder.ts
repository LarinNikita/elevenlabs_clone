import { useCallback, useEffect, useRef, useState } from "react";

import WaveSurfer from "wavesurfer.js";
import type RecordRTCType from "recordrtc";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recordRef = useRef<RecordRTCType | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const micStreamRef = useRef<{ onDestroy: () => void } | null>(null);

  const destroyWaveSurfer = useCallback(() => {
    if (micStreamRef.current) {
      micStreamRef.current.onDestroy();
      micStreamRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.destroy();
      wsRef.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recordRef.current) {
      recordRef.current.destroy();
      recordRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    destroyWaveSurfer();
  }, [destroyWaveSurfer]);

  useEffect(() => {
    if (!isRecording || !containerRef.current || !streamRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "hsl(--foreground) / 0.5",
      height: 144,
      barWidth: 1,
      barGap: 2,
      barRadius: 1,
      cursorWidth: 0,
      barMinHeight: 10,
      barHeight: 2,
      normalize: true,
    });

    wsRef.current = ws;

    const record = ws.registerPlugin(
      RecordPlugin.create({
        scrollingWaveform: true,
      }),
    );

    const handle = record.renderMicStream(streamRef.current);
    micStreamRef.current = handle;

    return () => {
      destroyWaveSurfer();
    };
  }, [isRecording, destroyWaveSurfer]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setAudioBlob(null);
      setElapsedTime(0);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const { default: RecordRTC, StereoAudioRecorder } =
        await import("recordrtc");

      const recorder = new RecordRTC(stream, {
        recorderType: StereoAudioRecorder,
        mimeType: "audio/wav",
        numberOfAudioChannels: 1,
        desiredSampRate: 44100,
      });

      recordRef.current = recorder;
      recorder.startRecording();
      setIsRecording(true);

      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 100);
    } catch (error) {
      cleanup();

      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setError(
          "Microphone access denied. Please allow microphone access in your browser settings.",
        );
      } else {
        setError("Failed to access microphone. Please check your device.");
      }
    }
  }, [cleanup]);

  const stopRecording = useCallback(
    (onBlob: (blob: Blob) => void) => {
      const recorder = recordRef.current;

      if (!recorder) return;

      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        setAudioBlob(blob);
        setIsRecording(false);
        cleanup();
        onBlob?.(blob);
      });
    },
    [cleanup],
  );

  const resetRecording = useCallback(() => {
    cleanup();
    setIsRecording(false);
    setElapsedTime(0);
    setAudioBlob(null);
    setError(null);
  }, [cleanup]);

  return {
    isRecording,
    elapsedTime,
    audioBlob,
    error,
    containerRef,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
