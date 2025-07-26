import { useRef, useEffect, useState } from "react";
import "./VideoThumbnail.css";

export default function VideoThumbnail({
                                           src,
                                           preview,
                                           setIsSeeking,
                                           setJustDraggedId,
                                           videoId,
                                       }) {
    const videoRef = useRef();
    const durationRef = useRef();
    const barRef = useRef();
    const fillRef = useRef();
    const rafRef = useRef();

    const [duration, setDuration] = useState(0);
    const [dragging, setDragging] = useState(false);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = String(Math.floor(seconds % 60)).padStart(2, "0");
        return `${m}:${s}`;
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onLoadedMetadata = () => {
            setDuration(video.duration);
            durationRef.current.textContent = formatTime(video.duration);
        };

        const onEnded = () => stopPreview();

        video.addEventListener("loadedmetadata", onLoadedMetadata);
        video.addEventListener("ended", onEnded);

        return () => {
            video.removeEventListener("loadedmetadata", onLoadedMetadata);
            video.removeEventListener("ended", onEnded);
        };
    }, [src]);

    const updateProgress = () => {
        const video = videoRef.current;
        if (!video || !duration) return;

        const remaining = Math.max(0, duration - video.currentTime);
        durationRef.current.textContent = formatTime(remaining);
        fillRef.current.style.transform = `scaleX(${video.currentTime / duration})`;
        rafRef.current = requestAnimationFrame(updateProgress);
    };

    const startPreview = () => {
        if (dragging) return;
        const video = videoRef.current;
        if (!video) return;

        if (video.currentTime >= duration - 0.1) video.currentTime = 0;
        video.play();
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(updateProgress);
    };

    const stopPreview = () => {
        if (dragging) return;
        const video = videoRef.current;
        if (!video) return;

        video.pause();
        video.currentTime = 0;
        cancelAnimationFrame(rafRef.current);
        durationRef.current.textContent = formatTime(duration);
        fillRef.current.style.transform = "scaleX(0)";
    };

    const seekTo = (clientX) => {
        const bar = barRef.current.getBoundingClientRect();
        const pct = Math.min(Math.max(0, clientX - bar.left), bar.width) / bar.width;
        const video = videoRef.current;
        video.currentTime = pct * duration;
        durationRef.current.textContent = formatTime(duration - video.currentTime);
        fillRef.current.style.transform = `scaleX(${pct})`;
    };

    useEffect(() => {
        let draggingActive = false;

        const onMouseDown = (e) => {
            e.stopPropagation();
            draggingActive = true;
            setDragging(true);
            setIsSeeking(true);
            videoRef.current.pause();
            cancelAnimationFrame(rafRef.current);
            seekTo(e.clientX);
        };

        const onMouseMove = (e) => {
            if (draggingActive) seekTo(e.clientX);
        };

        const onMouseUp = () => {
            if (!draggingActive) return;
            draggingActive = false;
            setDragging(false);
            setIsSeeking(false);
            setJustDraggedId(videoId);
            preview ? startPreview() : stopPreview();
        };

        const bar = barRef.current;
        bar.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);

        return () => {
            bar.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
    }, [duration, preview, setIsSeeking, setJustDraggedId, videoId]);

    useEffect(() => {
        preview ? startPreview() : stopPreview();
    }, [preview]);

    return (
        <div className={`thumbnail-container ${dragging ? "dragging" : ""}`}>
            <video ref={videoRef} src={src} muted preload="metadata" className="thumbnail" />
            <span ref={durationRef} className="video-duration">
        0:00
      </span>
            <div
                ref={barRef}
                className={`progress-bar ${dragging ? "dragging" : ""}`}
                onClick={(e) => {
                    e.stopPropagation();
                    seekTo(e.clientX);
                }}
            >
                <div ref={fillRef} className="progress-fill" />
            </div>
        </div>
    );
}
