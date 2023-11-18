import { useState, useEffect, useRef, useCallback } from "react";
import { Timestamps } from "./Timestamps";
import { throttle } from "../common/throttle";

export function BoundingBoxes() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [eventsData, setEventsData] = useState<Event[]>([]);
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);

  const scaleCoordinates = useCallback((
    originalX: number,
    originalY: number,
    videoElement: HTMLVideoElement
  ) => {
    // Get the original video size
    const originalWidth = videoElement.videoWidth;
    const originalHeight = videoElement.videoHeight;

    // Get the size of the video element in the HTML
    const containerWidth = videoElement.clientWidth;
    const containerHeight = videoElement.clientHeight;

    // Calculate scaled coordinates
    const scaledX = (originalX / originalWidth) * containerWidth;
    const scaledY = (originalY / originalHeight) * containerHeight;

    // Return scaled coordinates
    return { x: scaledX, y: scaledY };
  }, []);

  const drawBoundingBoxes = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && video && ctx) {
      canvas.width = video.offsetWidth;
      canvas.height = video.offsetHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      boundingBoxes.forEach((box: BoundingBox) => {
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "green";
        const { x, y } = scaleCoordinates(box.left, box.top, video);
        ctx.rect(x, y, box.width, box.height);
        ctx.stroke();
      });
    }
  }, [boundingBoxes, scaleCoordinates]);

  const handleRedrawBoundingBoxes = useCallback(() => {
    if (videoRef?.current) {
      const { currentTime } = videoRef.current;
      const events = [];

      for (const event of eventsData) {
        if (currentTime < event.timestamp) {
          break;
        }

        if (
          currentTime >= event.timestamp &&
          currentTime <= event.timestamp + event.duration
        ) {
          events.push(event.zone);
        }
      }
      setBoundingBoxes(events);
    }
  }, [eventsData]);

  function goToTimestamp(timestamp: number) {
    const video = videoRef.current;
    if (video) { video.currentTime = timestamp; }
  }

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const response = await fetch(
          "https://run.mocky.io/v3/085041d6-c0a5-4d4c-8ba9-829a0212d75b"
        );
        const data = await response.json();
        setEventsData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEventsData();
  }, []);

  useEffect(() => {
    const scrollEventHandler = throttle(handleRedrawBoundingBoxes, 50);
    window.addEventListener("resize", scrollEventHandler);

    return () => {
      window.removeEventListener("resize", scrollEventHandler);
    };
  }, [handleRedrawBoundingBoxes]);

  useEffect(() => {
    drawBoundingBoxes();
  }, [boundingBoxes, drawBoundingBoxes]);

  return (
    <div className="wrapper">
      <video
        className="video"
        ref={videoRef}
        onTimeUpdate={handleRedrawBoundingBoxes}
        controls
      >
        <source
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          type="video/mp4"
        />
        Your browser does not support playing video
      </video>
      <canvas className="canvas" ref={canvasRef} />
      <Timestamps currentTimestamp={videoRef?.current?.currentTime || 0} eventsData={eventsData} goToTimestamp={goToTimestamp} />
    </div>
  );
}
