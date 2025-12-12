"use client";
import { useEffect, useRef, useState } from "react";

function waitIceComplete(pc: RTCPeerConnection) {
    if (pc.iceGatheringState === "complete") return Promise.resolve();
    return new Promise<void>((resolve) => {
        const onChange = () => {
            if (pc.iceGatheringState === "complete") {
                pc.removeEventListener("icegatheringstatechange", onChange);
                resolve();
            }
        };
        pc.addEventListener("icegatheringstatechange", onChange);
    });
}

export default function WhepPlayer({ whepUrl }: { whepUrl: string }) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const [status, setStatus] = useState<"connecting" | "live" | "error">("connecting");

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setStatus("connecting");

                const pc = new RTCPeerConnection({
                    // dev local thường không cần STUN/TURN, nhưng để cũng không sao
                    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
                });
                pcRef.current = pc;

                pc.ontrack = (e) => {
                    if (!videoRef.current) return;
                    videoRef.current.srcObject = e.streams[0];
                    videoRef.current.play().catch(() => { });
                    setStatus("live");
                };

                pc.onconnectionstatechange = () => {
                    if (["failed", "disconnected", "closed"].includes(pc.connectionState)) {
                        setStatus("error");
                    }
                };

                const offer = await pc.createOffer({ offerToReceiveVideo: true, offerToReceiveAudio: true });
                await pc.setLocalDescription(offer);

                await waitIceComplete(pc);
                if (cancelled) return;

                const res = await fetch(whepUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/sdp" },
                    body: pc.localDescription?.sdp ?? "",
                });
                if (!res.ok) throw new Error(`WHEP failed: ${res.status}`);

                const answerSdp = await res.text();
                await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
            } catch (err) {
                console.error(err);
                if (!cancelled) setStatus("error");
            }
        })();

        return () => {
            cancelled = true;
            pcRef.current?.close();
            pcRef.current = null;
            if (videoRef.current) videoRef.current.srcObject = null;
        };
    }, [whepUrl]);

    return (
        <div className="relative bg-black aspect-video w-full">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {status !== "live" && (
                <div className="absolute inset-0 grid place-items-center text-white text-xs bg-black/40">
                    {status === "connecting" ? "Đang kết nối..." : "Lỗi kết nối"}
                </div>
            )}
        </div>
    );
}
