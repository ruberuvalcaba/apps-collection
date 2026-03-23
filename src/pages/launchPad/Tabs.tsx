const Tabs = ({
  onTabChange,
  activeTab,
  tabsList,
}: {
  onTabChange: (tab: string) => void;
  activeTab: string;
  tabsList: { name: string; component: React.ReactNode }[];
}) => {
  return (
    <div role="tablist" className="tabs tabs-lift">
      {tabsList.map((tab, index) => (
        <>
          <a
            key={`${index}-${tab.name}`}
            role="tab"
            className={`tab ${tab.name === activeTab ? "tab-active" : ""}`}
            onClick={() => onTabChange(tab.name)}
          >
            {tab.name}
          </a>
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {tab.name === activeTab ? tab.component : null}
          </div>
        </>
      ))}
    </div>
  );
};

export default Tabs;
