import { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { useBrowserStore } from "~/store/browserStore";

export function HistoryAnalytics() {
  const { history } = useBrowserStore();
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);
  const [topDomains, setTopDomains] = useState<
    { domain: string; visits: number }[]
  >([]);
  const [dailyVisits, setDailyVisits] = useState<
    { date: string; visits: number }[]
  >([]);
  const [averageTime, setAverageTime] = useState<number>(0);

  useEffect(() => {
    // Calculate top domains
    const domains = history.reduce(
      (acc, entry) => {
        const domain = new URL(entry.url).hostname;
        acc[domain] = (acc[domain] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    setTopDomains(
      Object.entries(domains)
        .map(([domain, visits]) => ({ domain, visits }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 10),
    );

    // Calculate daily visits
    const days = eachDayOfInterval({
      start: subDays(new Date(), timeRange),
      end: new Date(),
    });

    const dailyStats = days.map(date => {
      const dayVisits = history.filter(
        entry =>
          format(new Date(entry.timestamp), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd"),
      ).length;

      return {
        date: format(date, "MMM dd"),
        visits: dayVisits,
      };
    });

    setDailyVisits(dailyStats);

    // Calculate average time per visit
    const totalTime = history.reduce(
      (acc, entry) => acc + (entry.duration || 0),
      0,
    );
    setAverageTime(totalTime / history.length / 60); // Convert to minutes
  }, [history, timeRange]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="p-6 bg-ctp-mantle rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Browsing Analytics</h2>
        <div className="flex gap-2">
          {[7, 30, 90].map(days => (
            <button
              key={days}
              onClick={() => setTimeRange(days as 7 | 30 | 90)}
              className={`px-3 py-1 rounded ${
                timeRange === days
                  ? "bg-ctp-blue text-white"
                  : "bg-ctp-surface0"
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="p-4 bg-ctp-surface0 rounded">
          <div className="text-sm text-ctp-subtext0 mb-1">Total Visits</div>
          <div className="text-2xl font-bold">{history.length}</div>
        </div>
        <div className="p-4 bg-ctp-surface0 rounded">
          <div className="text-sm text-ctp-subtext0 mb-1">
            Average Time per Visit
          </div>
          <div className="text-2xl font-bold">
            {averageTime.toFixed(1)} minutes
          </div>
        </div>
        <div className="p-4 bg-ctp-surface0 rounded">
          <div className="text-sm text-ctp-subtext0 mb-1">Unique Domains</div>
          <div className="text-2xl font-bold">{topDomains.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-4">Daily Activity</h3>
          <div className="h-[300px]">
            <Line
              data={{
                labels: dailyVisits.map(d => d.date),
                datasets: [
                  {
                    label: "Visits",
                    data: dailyVisits.map(d => d.visits),
                    borderColor: "rgb(138, 173, 244)",
                    tension: 0.3,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Top Domains</h3>
          <div className="h-[300px]">
            <Bar
              data={{
                labels: topDomains.map(d => d.domain),
                datasets: [
                  {
                    label: "Visits",
                    data: topDomains.map(d => d.visits),
                    backgroundColor: "rgb(138, 173, 244)",
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
