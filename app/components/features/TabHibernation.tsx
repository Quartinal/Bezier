import { useState } from "react";
import { motion } from "framer-motion";
import type { TabHibernationRule } from "~/types/browser";

export function TabHibernation() {
  const [rules, setRules] = useState<TabHibernationRule[]>([]);
  const [editingRule, setEditingRule] = useState<TabHibernationRule | null>(
    null,
  );

  const addRule = (rule: TabHibernationRule) => {
    setRules([...rules, rule]);
  };

  const updateRule = (id: string, updates: Partial<TabHibernationRule>) => {
    setRules(
      rules.map(rule => (rule.id === id ? { ...rule, ...updates } : rule)),
    );
  };

  return (
    <div className="p-6 bg-ctp-mantle rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Tab Hibernation</h2>
        <button
          onClick={() =>
            setEditingRule({
              id: "",
              name: "",
              conditions: {
                inactiveTime: 30,
                maxTabs: 10,
                excludeDomains: [],
              },
              action: "hibernate",
              isEnabled: true,
              condition: "",
              value: 0,
            })
          }
          className="px-4 py-2 bg-ctp-blue text-white rounded"
        >
          Add Rule
        </button>
      </div>

      <div className="space-y-4">
        {rules.map(rule => (
          <motion.div
            key={rule.id}
            layoutId={rule.id}
            className="p-4 bg-ctp-surface0 rounded"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">{rule.name}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateRule(rule.id, { isEnabled: !rule.isEnabled })
                  }
                  className={`w-10 h-6 rounded-full transition-colors ${
                    rule.isEnabled ? "bg-ctp-blue" : "bg-ctp-surface1"
                  }`}
                >
                  <motion.div
                    animate={{ x: rule.isEnabled ? 16 : 2 }}
                    className="w-5 h-5 bg-white rounded-full"
                  />
                </button>
                <button
                  onClick={() => setEditingRule(rule)}
                  className="p-2 hover:bg-ctp-surface1 rounded"
                >
                  Edit
                </button>
              </div>
            </div>

            <div className="text-sm text-ctp-subtext0">
              <div>
                Hibernate after {rule.conditions.inactiveTime} minutes of
                inactivity
              </div>
              <div>
                When there are more than {rule.conditions.maxTabs} tabs open
              </div>
              {rule.conditions.excludeDomains.length > 0 && (
                <div>
                  Excluding: {rule.conditions.excludeDomains.join(", ")}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rule Editor Modal */}
      {editingRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="w-[500px] bg-ctp-mantle rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">
              {editingRule.id ? "Edit Rule" : "New Rule"}
            </h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="rule-name" className="block mb-1 font-medium">
                  Rule Name
                </label>
                <input
                  id="rule-name"
                  type="text"
                  value={editingRule.name}
                  onChange={e =>
                    setEditingRule({ ...editingRule, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-ctp-surface0 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="inactive-time"
                  className="block mb-1 font-medium"
                >
                  Inactive Time (minutes)
                </label>
                <input
                  id="inactive-time"
                  type="number"
                  value={editingRule.conditions.inactiveTime}
                  onChange={e =>
                    setEditingRule({
                      ...editingRule,
                      conditions: {
                        ...editingRule.conditions,
                        inactiveTime: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-ctp-surface0 rounded"
                />
              </div>

              <div>
                <label htmlFor="max-tabs" className="block mb-1 font-medium">
                  Maximum Tabs
                </label>
                <input
                  id="max-tabs"
                  type="number"
                  value={editingRule.conditions.maxTabs}
                  onChange={e =>
                    setEditingRule({
                      ...editingRule,
                      conditions: {
                        ...editingRule.conditions,
                        maxTabs: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-ctp-surface0 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="excluded-domains"
                  className="block mb-1 font-medium"
                >
                  Excluded Domains
                </label>
                <input
                  id="excluded-domains"
                  type="text"
                  value={editingRule.conditions.excludeDomains.join(", ")}
                  onChange={e =>
                    setEditingRule({
                      ...editingRule,
                      conditions: {
                        ...editingRule.conditions,
                        excludeDomains: e.target.value
                          .split(",")
                          .map(d => d.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  placeholder="example.com, another.com"
                  className="w-full px-3 py-2 bg-ctp-surface0 rounded"
                />
              </div>

              <div>
                <label
                  htmlFor="action-select"
                  className="block mb-1 font-medium"
                >
                  Action
                </label>
                <select
                  id="action-select"
                  value={editingRule.action}
                  onChange={e =>
                    setEditingRule({
                      ...editingRule,
                      action: e.target.value as TabHibernationRule["action"],
                    })
                  }
                  className="w-full px-3 py-2 bg-ctp-surface0 rounded"
                >
                  <option value="hibernate">Hibernate</option>
                  <option value="close">Close</option>
                  <option value="group">Group</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditingRule(null)}
                className="px-4 py-2 bg-ctp-surface1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingRule.id) {
                    updateRule(editingRule.id, editingRule);
                  } else {
                    addRule({ ...editingRule, id: crypto.randomUUID() });
                  }
                  setEditingRule(null);
                }}
                className="px-4 py-2 bg-ctp-blue text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
