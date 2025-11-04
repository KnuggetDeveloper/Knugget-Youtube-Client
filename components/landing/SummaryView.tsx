'use client';

interface SummaryData {
  keyTakeaways: Array<{ icon: string; text: string }>;
  detailedNotes: Array<{ title: string; content: string }>;
  quotes: Array<{ icon: string; text: string }>;
  examples: Array<{ icon: string; text: string }>;
}

interface SummaryViewProps {
  summary: SummaryData;
}

export default function SummaryView({ summary }: SummaryViewProps) {
  return (
    <div className="space-y-8">
      {/* Top 3 Key Takeaways */}
      <div>
        <h4
          className="text-xl font-semibold mb-4 relative"
          style={{ color: "var(--text-primary)" }}
        >
          Top 3 Key Takeaways
          <div
            className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
            style={{ background: "var(--accent-gradient)" }}
          />
        </h4>
        <div className="space-y-4">
          {summary.keyTakeaways.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 items-start p-2 rounded transition-all duration-300"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 107, 53, 0.05)";
                e.currentTarget.style.margin = "0 -8px";
                e.currentTarget.style.padding = "8px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.margin = "0";
                e.currentTarget.style.padding = "8px 0";
              }}
            >
              <span className="text-lg flex-shrink-0 mt-0.5">
                {item.icon}
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
      </div>

      {/* Top 3 Memorable Quotes */}
      <div>
        <h4
          className="text-xl font-semibold mb-4 relative"
          style={{ color: "var(--text-primary)" }}
        >
          Top 3 Memorable Quotes
          <div
            className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
            style={{ background: "var(--accent-gradient)" }}
          />
        </h4>
        <div className="space-y-4">
          {summary.quotes.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 items-start p-2 rounded transition-all duration-300"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 107, 53, 0.05)";
                e.currentTarget.style.margin = "0 -8px";
                e.currentTarget.style.padding = "8px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.margin = "0";
                e.currentTarget.style.padding = "8px 0";
              }}
            >
              <span className="text-lg flex-shrink-0 mt-0.5">
                {item.icon}
              </span>
              <span
                className="text-sm leading-relaxed italic"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top 3 Examples */}
      <div>
        <h4
          className="text-xl font-semibold mb-4 relative"
          style={{ color: "var(--text-primary)" }}
        >
          Top 3 Examples
          <div
            className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
            style={{ background: "var(--accent-gradient)" }}
          />
        </h4>
        <div className="space-y-4">
          {summary.examples.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 items-start p-2 rounded transition-all duration-300"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 107, 53, 0.05)";
                e.currentTarget.style.margin = "0 -8px";
                e.currentTarget.style.padding = "8px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.margin = "0";
                e.currentTarget.style.padding = "8px 0";
              }}
            >
              <span className="text-lg flex-shrink-0 mt-0.5">
                {item.icon}
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
      </div>

      {/* Detailed Note of All Key Points */}
      <div>
        <h4
          className="text-xl font-semibold mb-4 relative"
          style={{ color: "var(--text-primary)" }}
        >
          Detailed Note of All Key Points
          <div
            className="absolute bottom-[-4px] left-0 w-10 h-0.5 rounded"
            style={{ background: "var(--accent-gradient)" }}
          />
        </h4>
        <div className="space-y-6">
          {summary.detailedNotes.map((section, index) => (
            <div
              key={index}
              className="p-4 rounded-lg transition-all duration-300"
              style={{
                background: "rgba(255, 107, 53, 0.02)",
                border: "1px solid rgba(255, 107, 53, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 107, 53, 0.05)";
                e.currentTarget.style.borderColor = "rgba(255, 107, 53, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 107, 53, 0.02)";
                e.currentTarget.style.borderColor = "rgba(255, 107, 53, 0.1)";
              }}
            >
              <h5
                className="text-lg font-medium mb-2"
                style={{ color: "var(--accent-primary)" }}
              >
                {section.title}
              </h5>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
