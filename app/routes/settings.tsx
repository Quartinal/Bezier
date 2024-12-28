import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ThemeEditor } from "~/components/features/ThemeEditor";
import { ExtensionManager } from "~/components/features/ExtensionManager";
import { TabHibernation } from "~/components/features/TabHibernation";
import { ShortcutManager } from "~/components/features/ShortcutManager";
import { PasswordManager } from "~/components/features/PasswordManager";

export default function Settings() {
  return (
    <div className="min-h-screen bg-ctp-base p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
            <TabsTrigger value="extensions">Extensions</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="space-y-6">
              <section>
                <h2 className="text-lg font-medium mb-4">Startup</h2>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="startup"
                      value="new"
                      className="text-ctp-blue"
                    />
                    Open the New Tab page
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="startup"
                      value="continue"
                      className="text-ctp-blue"
                    />
                    Continue where you left off
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="startup"
                      value="specific"
                      className="text-ctp-blue"
                    />
                    Open specific pages
                  </label>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-medium mb-4">Downloads</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="download-location" className="block mb-1">
                      Default download location
                    </label>
                    <input
                      id="download-location"
                      type="text"
                      className="w-full px-3 py-2 bg-ctp-surface0 rounded"
                      placeholder="Downloads folder"
                    />
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-ctp-blue" />
                    Ask where to save each file before downloading
                  </label>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-medium mb-4">Search engine</h2>
                <select className="w-full px-3 py-2 bg-ctp-surface0 rounded">
                  <option>Google</option>
                  <option>Bing</option>
                  <option>DuckDuckGo</option>
                </select>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="appearance">
            <ThemeEditor />
          </TabsContent>

          <TabsContent value="privacy">
            <div className="space-y-6">
              <PasswordManager />

              <section>
                <h2 className="text-lg font-medium mb-4">Privacy</h2>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-ctp-blue" />
                    Send &quot;Do Not Track&quot; request with browsing traffic
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-ctp-blue" />
                    Use secure DNS
                  </label>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-medium mb-4">Cookies</h2>
                <select className="w-full px-3 py-2 bg-ctp-surface0 rounded">
                  <option>Allow all cookies</option>
                  <option>Block third-party cookies</option>
                  <option>Block all cookies</option>
                </select>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="extensions">
            <ExtensionManager />
          </TabsContent>

          <TabsContent value="advanced">
            <div className="space-y-6">
              <TabHibernation />
              <ShortcutManager />

              <section>
                <h2 className="text-lg font-medium mb-4">System</h2>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-ctp-blue" />
                    Use hardware acceleration when available
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="text-ctp-blue" />
                    Continue running background apps when browser is closed
                  </label>
                </div>
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
