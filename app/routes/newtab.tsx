import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface TopSite {
  url: string;
  title: string;
  favicon: string;
  visits: number;
}

export async function loader() {
  // In a real implementation, this would come from the browser's API
  const topSites: TopSite[] = [];
  return json({ topSites });
}

export default function NewTab() {
  const { topSites } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-ctp-base p-8">
      <div className="max-w-4xl mx-auto">
        {/* Clock */}
        <div className="text-center mb-12">
          <Clock className="w-12 h-12 mx-auto mb-4 text-ctp-blue" />
          <Time />
        </div>

        {/* Search */}
        <div className="mb-12">
          <input
            type="text"
            placeholder="Search or enter website name"
            className="w-full px-4 py-3 bg-ctp-surface0 rounded-lg"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </div>

        {/* Top Sites */}
        <div className="grid grid-cols-4 gap-4">
          {topSites.map(site => (
            <motion.a
              key={site.url}
              href={site.url}
              className="p-4 bg-ctp-surface0 rounded-lg hover:bg-ctp-surface1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={site.favicon} alt="" className="w-8 h-8 mb-2" />
              <div className="font-medium truncate">{site.title}</div>
              <div className="text-sm text-ctp-subtext0">
                {site.visits} visits
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}

function Time() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-6xl font-bold">
      {time.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </div>
  );
}
