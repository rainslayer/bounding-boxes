interface BoundingBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Event {
  timestamp: number;
  duration: number;
  zone: BoundingBox;
}