'use client';

interface TranscriptItem {
  time: string;
  text: string;
}

interface TranscriptViewProps {
  transcripts: TranscriptItem[];
}

export default function TranscriptView({ transcripts }: TranscriptViewProps) {
  return (
    <div className="space-y-2">
      {transcripts.map((item, index) => (
        <div
          key={index}
          className="flex gap-4 items-start py-2 px-3 rounded transition-all duration-300 cursor-pointer hover:bg-opacity-50"
          style={{
            borderLeft: "3px solid transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 107, 53, 0.05)";
            e.currentTarget.style.borderLeftColor = "var(--accent-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderLeftColor = "transparent";
          }}
        >
          <span
            className="text-xs font-mono px-2 py-1 rounded flex-shrink-0"
            style={{
              background: "var(--accent-primary)",
              color: "var(--primary-bg)",
              minWidth: "45px",
              textAlign: "center",
            }}
          >
            {item.time}
          </span>
          <span
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {item.text}
          </span>
        </div>
      ))}
    </div>
  );
}

