// app/settings/page.tsx
import React from "react";
import DesignerMainSettings, {
  DesignerMainSettingsProps,
} from "@/components/settings/designerMainSettings";

interface SettingsList extends DesignerMainSettingsProps {}

const EXAMPLE_SETTINGS: SettingsList[] = [
  {
    link: "/settings/frontend/navbar",
    linkLabel: "Navbar Settings",
    isFinalized: false,
    progress: 0,
    notes: "",
  },
  {
    link: "/settings/frontend/leftsidebar",
    linkLabel: "LeftSidebar Settings",
    isFinalized: false,
    progress: 0,
    notes: "",
  },
];

export default function SettingsFrontendPage(): JSX.Element {
  return (
    <div className="p-6">
      <h1 className="sm:text-5xl font-bold mb-4">
        Frontend Developer - Maverick Rosales
      </h1>
      <p className="mb-6">Welcome to the frontend developer settings.</p>

      <div className="space-y-4">
        {EXAMPLE_SETTINGS.map((setting) => (
          <DesignerMainSettings key={setting.link} {...setting} />
        ))}
      </div>
    </div>
  );
}
