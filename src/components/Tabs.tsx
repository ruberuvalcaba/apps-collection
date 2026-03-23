import Typewriter from "./Typewriter";
import DataTable from "./DataTable";
import WordleGame from "./WordleGame";
import { mockColumsData, mockRowsData } from "../mockData";

const tabsList = [
  { name: "Typewriter", component: <Typewriter /> },
  {
    name: "Data Table",
    component: <DataTable data={mockRowsData} columns={mockColumsData} />,
  },
  { name: "Wordle Game", component: <WordleGame /> },
];

const Tabs = ({
  onTabChange,
  activeTab,
}: {
  onTabChange: (tab: string) => void;
  activeTab: string;
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
