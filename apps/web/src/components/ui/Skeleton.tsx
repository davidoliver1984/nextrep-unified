type Props = {
    height?: number;
    width?: number | string;
    radius?: number;
  };

  export function Skeleton({ height = 14, width = "100%", radius = 10 }: Props) {
    return (
      <div
        aria-hidden="true"
        style={{
          height,
          width,
          borderRadius: radius,
          background: "linear-gradient(90deg, #eee, #f7f7f7, #eee)",
          backgroundSize: "200% 100%",
          animation: "sk 1.2s ease-in-out infinite",
        }}
      />
    );
  }