import { useState } from "react";
import { useBrowserStore } from "~/store/browserStore";
import { HistoryAnalytics } from "~/components/features/HistoryAnalytics";
import { format, isSameDay, subDays } from "date-fns";

export default function History() {
  const { history } = useBrowserStore();
  const [search, setSearch] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Group history entries by date
  const groupedHistory = history.reduce(
    (groups, entry) => {
      const date = format(new Date(entry.timestamp), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
      return groups;
    },
    {} as Record<string, typeof history>,
  );

  return (
    <div className="min-h-screen bg-ctp-base p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">History</h1>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="px-4 py-2 bg-ctp-surface0 rounded"
          >
            {showAnalytics ? "View History" : "View Analytics"}
          </button>
        </div>

        {showAnalytics ? (
          <HistoryAnalytics />
        ) : (
          <>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search history..."
              className="w-full px-4 py-3 mb-6 bg-ctp-surface0 rounded"
            />

            <div className="space-y-6">
              {Object.entries(groupedHistory).map(([date, entries]) => (
                <div key={date}>
                  <h2 className="text-lg font-medium mb-3">
                    {isSameDay(new Date(date), new Date())
                      ? "Today"
                      : isSameDay(new Date(date), subDays(new Date(), 1))
                        ? "Yesterday"
                        : format(new Date(date), "MMMM d, yyyy")}
                  </h2>

                  <div className="space-y-2">
                    {entries.map(entry => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-4 p-3 bg-ctp-surface0 rounded"
                      >
                        {entry.favicon && (
                          <img src={entry.favicon} alt="" className="w-4 h-4" />
                        )}
                        <div>
                          <div className="font-medium">{entry.title}</div>
                          <div className="text-sm text-ctp-subtext0">
                            {entry.url}
                          </div>
                        </div>
                        <div className="ml-auto text-sm text-ctp-subtext0">
                          {format(new Date(entry.timestamp), "h:mm a")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
