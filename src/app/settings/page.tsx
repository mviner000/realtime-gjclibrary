// app/settings/page.tsx
import React from "react";
import DesignerMainSettings, {
  DesignerMainSettingsProps,
} from "@/components/settings/designerMainSettings";
import SettingsCard from "@/components/settings/settingsCard";

interface SettingsList extends DesignerMainSettingsProps {}

const EXAMPLE_SETTINGS: SettingsList[] = [
  {
    link: "/settings/navbar",
    linkLabel: "Navbar Settings",
    isFinalized: false,
    progress: 0,
    notes: "",
  },
  {
    link: "/settings/leftsidebar",
    linkLabel: "LeftSidebar Settings",
    isFinalized: false,
    progress: 0,
    notes: "",
  },
];

export default function SettingsPage(): JSX.Element {
  return (
    <div>
      <h1 className="md:text-6xl font-bold text-center">
        Admin & Moderator Settings
      </h1>
      <SettingsCard />

      {/* <div className="space-y-4">
        {EXAMPLE_SETTINGS.map((setting) => (
          <DesignerMainSettings
            key={setting.link}
            {...setting}
          />
        ))}
      </div> */}
    </div>
  );
}
