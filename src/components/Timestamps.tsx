interface IComponentProps {
  currentTimestamp: number;
  eventsData: Event[];
  goToTimestamp: (timestamp: number) => void;
}

export function Timestamps({
  currentTimestamp,
  eventsData,
  goToTimestamp,
}: IComponentProps) {
  const className = "timestamp-element";
  
  function generateTimestampClassNames(timestamp: number) {
    if (currentTimestamp > timestamp) {
      return className.concat(" timestamp-element--disabled");
    }

    return className;
  }

  function formatTimestamp(timestamp: number) {
    const date = new Date(timestamp * 1000);

    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");

    return `${minutes}:${seconds}:${milliseconds}`;
  }

  return (
    <ul className="timestamp-list">
      {eventsData.map((event, idx) => (
        <li
          onClick={() => goToTimestamp(event.timestamp)}
          className={generateTimestampClassNames(event.timestamp)}
          key={`Event ${idx}`}
        >
          {formatTimestamp(event.timestamp)}
        </li>
      ))}
    </ul>
  );
}
