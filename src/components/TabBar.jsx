import { TABS } from "../constants/csaData.js";

export default function TabBar({ activeTab, setActiveTab, validations }) {
  const errorByTab = validations.reduce((acc, item) => {
    acc[item.tabId] = acc[item.tabId] || 0;
    if (item.level === "error") acc[item.tabId] += 1;
    return acc;
  }, {});

  return (
    <div className="tabbar">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span>{tab.short}</span>
          <small>{tab.label}</small>
          {errorByTab[tab.id] ? <em>{errorByTab[tab.id]}</em> : null}
        </button>
      ))}
    </div>
  );
}
