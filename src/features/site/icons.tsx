import type { SVGProps } from "react";

export type IconName =
  | "leaf"
  | "arrow"
  | "menu"
  | "check"
  | "tomato"
  | "bowl"
  | "chat"
  | "carrot"
  | "phone"
  | "clock"
  | "search"
  | "coach24"
  | "specialist"
  | "target100"
  | "method"
  | "flame"
  | "muscle"
  | "scale"
  | "spark"
  | "star"
  | "crown";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export function Icon({ name, className, ...props }: IconProps) {
  const baseProps: SVGProps<SVGSVGElement> = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.65,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": "true",
    ...props,
  };

  switch (name) {
    case "flame":
      return (
        <svg {...baseProps}>
          <path d="M12.5 2.5c.3 3-1.6 4.8-3.1 6.6C7.8 11 6.5 12.8 6.5 15.2a5.5 5.5 0 0 0 11 0c0-3.2-2-5.6-3.8-7.2-.3 1.3-1.1 2.2-2.2 2.6.6-2.4.5-5.3 1-8.1Z" />
          <path d="M10.2 16.2a2.2 2.2 0 0 0 3.8 1.2c.4-.6.5-1.5.1-2.4" />
        </svg>
      );

    case "scale":
      return (
        <svg {...baseProps}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
          <path d="M8 10.5a4 4 0 0 1 8 0Z" />
          <path d="M12 10.5l1.6-2.2" />
          <path d="M8.5 16.5h7" />
        </svg>
      );

    case "muscle":
      return (
        <svg {...baseProps}>
          <path d="M6.5 7.5v9M3.5 9.5v5M17.5 7.5v9M20.5 9.5v5" />
          <path d="M6.5 12h11" />
        </svg>
      );

    case "target100":
      return (
        <svg {...baseProps}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.8" />
          <path d="M10.4 12.1l1.2 1.2 2.4-2.5" />
        </svg>
      );

    case "coach24":
      return (
        <svg {...baseProps}>
          <path d="M4.5 12a7.5 7.5 0 0 1 15 0v3.5a2.5 2.5 0 0 1-2.5 2.5h-1a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 1.5-1.5h2" />
          <path d="M4.5 12h2A1.5 1.5 0 0 1 8 13.5v3A1.5 1.5 0 0 1 6.5 18h-1A2.5 2.5 0 0 1 3 15.5V12" />
          <path d="M17 18v.5a2.5 2.5 0 0 1-2.5 2.5H11" />
        </svg>
      );

    case "specialist":
      return (
        <svg {...baseProps}>
          <path d="M12 3.2l7 3.1v5.4c0 4.8-3 8.6-7 9.8-4-1.2-7-5-7-9.8V6.3l7-3.1Z" />
          <path d="M12 9v6M9 12h6" />
        </svg>
      );

    case "method":
      return (
        <svg {...baseProps}>
          <path d="M12 3.5l2.3 5.2 5.2 2.3-5.2 2.3L12 18.5l-2.3-5.2-5.2-2.3 5.2-2.3L12 3.5Z" />
          <path d="M18.5 17.5l.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8.8-1.8Z" />
        </svg>
      );

    case "spark":
      return (
        <svg {...baseProps}>
          <path d="M12 3l2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z" />
        </svg>
      );

    case "star":
      return (
        <svg {...baseProps}>
          <path d="M12 3.2l2.6 5.3 5.9.8-4.3 4.2 1 5.8L12 16.5l-5.2 2.8 1-5.8-4.3-4.2 5.9-.8L12 3.2Z" />
        </svg>
      );

    case "crown":
      return (
        <svg {...baseProps}>
          <path d="M3.5 17.5h17M4.5 14.5l-1-8 5 3.5L12 4.5l3.5 5.5 5-3.5-1 8h-15Z" />
        </svg>
      );

    case "bowl":
      return (
        <svg {...baseProps}>
          <path d="M3.5 11.5h17a8.5 8.5 0 0 1-17 0Z" />
          <path d="M7.5 11.5a3.5 3.5 0 0 1 6.5-1.5 3 3 0 0 1 4.5 1.5" />
          <path d="M9 20h6" />
        </svg>
      );

    case "leaf":
      return (
        <svg {...baseProps}>
          <path d="M19.5 4.5C12 4.5 6 9.5 6 17c0 1 .2 1.8.4 2.5 7.5 0 13.1-5.8 13.1-15Z" />
          <path d="M6.4 19.5C10 15 14 11.8 18.5 9" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...baseProps}>
          <path d="M19 12H5m0 0l5.5-5.5M5 12l5.5 5.5" />
        </svg>
      );

    case "menu":
      return (
        <svg {...baseProps}>
          <path d="M4 7.5h16M4 12h16M4 16.5h10" />
        </svg>
      );

    case "check":
      return (
        <svg {...baseProps}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M8.5 12.2l2.3 2.3 4.8-4.8" />
        </svg>
      );

    case "chat":
      return (
        <svg {...baseProps}>
          <path d="M20 11.5a8.5 8.5 0 0 1-12.5 7.5L4 20l1.2-3.6A8.5 8.5 0 1 1 20 11.5Z" />
          <path d="M9 11.5h6M9 14.5h3.5" />
        </svg>
      );

    case "phone":
      return (
        <svg {...baseProps}>
          <rect x="6.5" y="2.5" width="11" height="19" rx="2.8" />
          <path d="M10.5 18.5h3" />
        </svg>
      );

    case "clock":
      return (
        <svg {...baseProps}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5v4.8l3 1.8" />
        </svg>
      );

    case "search":
      return (
        <svg {...baseProps}>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.8-3.8" />
        </svg>
      );

    case "tomato":
    case "carrot":
    default:
      return (
        <svg {...baseProps}>
          <circle cx="12" cy="13" r="7.5" />
          <path d="M12 3.5v3M9.5 5l2.5 1.5L14.5 5" />
        </svg>
      );
  }
}
