import { useState } from "react";
import Tabs from "./Tabs";
import Typewriter from "../../components/Typewriter";
import DataTable from "../../components/DataTable";
import WordleGame from "../../components/WordleGame";
import { mockColumsData, mockRowsData } from "../../mockData";

const tabsList = [
  { name: "Typewriter", component: <Typewriter /> },
  {
    name: "Data Table",
    component: <DataTable data={mockRowsData} columns={mockColumsData} />,
  },
  { name: "Wordle Game", component: <WordleGame /> },
];

const LaunchPad = () => {
  const [activeTab, setActiveTab] = useState<string>(tabsList[0].name);
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <a className="btn btn-ghost text-xl">Apps Collection</a>
      </div>
      <Tabs
        onTabChange={handleTabChange}
        activeTab={activeTab}
        tabsList={tabsList}
      />
    </>
  );
};

export default LaunchPad;
