import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import useSpeechRecognition from "../../hooks/useSpeechRecognition";

describe("useSpeechRecognition", () => {
    const originalWindow = globalThis.window;

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("isSupported", () => {
        it("returns true when SpeechRecognition is available", () => {
            (window as any).SpeechRecognition = vi.fn();

            const { result } = renderHook(() =>
                useSpeechRecognition(vi.fn()),
            );

            expect(result.current.isSupported).toBe(true);

            delete (window as any).SpeechRecognition;
        });

        it("returns true when webkitSpeechRecognition is available", () => {
            (window as any).webkitSpeechRecognition = vi.fn();

            const { result } = renderHook(() =>
                useSpeechRecognition(vi.fn()),
            );

            expect(result.current.isSupported).toBe(true);

            delete (window as any).webkitSpeechRecognition;
        });

        it("returns false when neither API is available", () => {
            delete (window as any).SpeechRecognition;
            delete (window as any).webkitSpeechRecognition;

            const { result } = renderHook(() =>
                useSpeechRecognition(vi.fn()),
            );

            expect(result.current.isSupported).toBe(false);
        });
    });

    describe("startRecording", () => {
        it("calls onError when speech recognition is not supported", () => {
            delete (window as any).SpeechRecognition;
            delete (window as any).webkitSpeechRecognition;

            const onTranscription = vi.fn();
            const onError = vi.fn();

            const { result } = renderHook(() =>
                useSpeechRecognition(onTranscription, onError),
            );

            result.current.startRecording();

            expect(onError).toHaveBeenCalledWith(
                "La reconnaissance vocale n'est pas prise en charge par votre navigateur.",
            );
        });

        it("does not crash when not supported and no onError provided", () => {
            delete (window as any).SpeechRecognition;
            delete (window as any).webkitSpeechRecognition;

            const onTranscription = vi.fn();

            const { result } = renderHook(() =>
                useSpeechRecognition(onTranscription),
            );

            // Should not throw
            expect(() => result.current.startRecording()).not.toThrow();
        });
    });

    describe("initial state", () => {
        it("starts with isRecording false and empty transcription", () => {
            const { result } = renderHook(() =>
                useSpeechRecognition(vi.fn()),
            );

            expect(result.current.isRecording).toBe(false);
            expect(result.current.transcription).toBe("");
        });
    });
});
