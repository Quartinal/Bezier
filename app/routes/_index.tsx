import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Browser } from "~/components/Browser";
import { useBrowserStore } from "~/store/browserStore";
import { useEffect } from "react";

export async function loader() {
  return json({
    initialTabs: [
      {
        id: "home",
        title: "New Tab",
        url: "browser://newtab",
        favicon: "",
        pinned: false,
        private: false,
        isActive: false,
        lastAccessed: Date.now(),
        muted: false,
        loading: false,
        hibernated: false,
      },
    ],
  });
}

export default function Index() {
  const { initialTabs } = useLoaderData<typeof loader>();
  const { initializeTabs } = useBrowserStore();

  useEffect(() => {
    return initializeTabs(initialTabs);
  }, [initialTabs, initializeTabs]);

  return <Browser />;
}