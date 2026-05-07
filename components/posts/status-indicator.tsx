import type { Status } from "@/lib/types";

const NAVY = "#0A2540";
const GOLD = "#C8A24B";
const GREEN = "#2F5D34";
const RED = "#A14829";

interface Props {
  status: Status;
  size?: number;
  className?: string;
}

export function StatusIndicator({ status, size = 8, className }: Props) {
  const s = size;
  const stroke = 1.5;
  const half = s / 2;

  switch (status) {
    case "Planned":
      return (
        <svg
          className={className}
          width={s}
          height={s}
          viewBox={`0 0 ${s} ${s}`}
          aria-label="Planned"
        >
          <circle
            cx={half}
            cy={half}
            r={half - stroke / 2}
            fill="none"
            stroke={NAVY}
            strokeWidth={stroke}
          />
        </svg>
      );
    case "In Progress":
      return (
        <svg
          className={className}
          width={s}
          height={s}
          viewBox={`0 0 ${s} ${s}`}
          aria-label="In progress"
        >
          <circle
            cx={half}
            cy={half}
            r={half - stroke / 2}
            fill={NAVY}
            stroke={NAVY}
            strokeWidth={stroke}
          />
          <rect x={0} y={half} width={s} height={half} fill={GOLD} />
          <circle
            cx={half}
            cy={half}
            r={half - stroke / 2}
            fill="none"
            stroke={NAVY}
            strokeWidth={stroke}
          />
        </svg>
      );
    case "Edited":
      return (
        <svg
          className={className}
          width={s}
          height={s}
          viewBox={`0 0 ${s} ${s}`}
          aria-label="Edited"
        >
          <circle
            cx={half}
            cy={half}
            r={half - stroke / 2}
            fill={GOLD}
            stroke={GOLD}
            strokeWidth={stroke}
          />
        </svg>
      );
    case "Scheduled":
      return (
        <svg
          className={className}
          width={s}
          height={s}
          viewBox={`0 0 ${s} ${s}`}
          aria-label="Scheduled"
        >
          <circle
            cx={half}
            cy={half}
            r={half - stroke / 2}
            fill={GREEN}
            stroke={GREEN}
            strokeWidth={stroke}
          />
        </svg>
      );
    case "Posted":
      return (
        <svg
          className={className}
          width={s}
          height={s}
          viewBox="0 0 16 16"
          aria-label="Posted"
        >
          <circle cx={8} cy={8} r={7.25} fill={GREEN} />
          <circle
            cx={8}
            cy={8}
            r={6}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={1}
          />
          <path
            d="M 5 8.2 L 7.2 10.4 L 11 6.2"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "Killed":
      return (
        <svg
          className={className}
          width={s}
          height={s}
          viewBox={`0 0 ${s} ${s}`}
          aria-label="Killed"
        >
          <circle
            cx={half}
            cy={half}
            r={half - stroke / 2}
            fill={RED}
            fillOpacity={0.4}
            stroke={RED}
            strokeOpacity={0.4}
            strokeWidth={stroke}
          />
        </svg>
      );
  }
}

export function statusColor(status: Status): string {
  switch (status) {
    case "Planned":
      return NAVY;
    case "In Progress":
      return GOLD;
    case "Edited":
      return GOLD;
    case "Scheduled":
      return GREEN;
    case "Posted":
      return GREEN;
    case "Killed":
      return RED;
  }
}
