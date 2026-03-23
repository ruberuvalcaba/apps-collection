import { useState } from "react";
import Tabs from "../../components/Tabs";

const LaunchPad = () => {
  const [activeTab, setActiveTab] = useState<string>("");
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <a className="btn btn-ghost text-xl">Apps Collection</a>
      </div>
      <Tabs onTabChange={handleTabChange} activeTab={activeTab} />
    </>
  );
};

export default LaunchPad;
