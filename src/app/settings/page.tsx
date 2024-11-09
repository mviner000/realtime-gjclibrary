import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GalleryHorizontal } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';

interface SettingsCardProps {
  /** URL that the card links to */
  link: string;
  /** Text label for the link */
  linkLabel: string;
  /** Whether the setting has been finalized */
  isFinalized: boolean;
  /** Progress percentage (0-100) */
  progress?: number;
  /** Notes to show in the tooltip */
  notes: string;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  link,
  linkLabel,
  isFinalized,
  progress = 0,
  notes,
}) => {
  return (
    <Card className="w-full max-w-md transition-all hover:shadow-lg">
    <Link
      href={link}
      className="text-blue-500 hover:text-blue-700 hover:underline"
    >
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <GalleryHorizontal className="h-5 w-5 text-blue-500 mr-1" />
              {linkLabel}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-200">
                    <div className="w-1 h-1 rounded-full bg-gray-400" />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{notes}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>{progress}% Complete</span>
            <span 
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                isFinalized 
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {isFinalized ? "Finalized" : "Not Finished"}
            </span>
          </div>
        </div>
      </CardContent>
      </Link>
    </Card>
  );
};

interface SettingsList {
  link: string;
  linkLabel: string;
  isFinalized: boolean;
  progress: number;
  notes: string;
}

const EXAMPLE_SETTINGS: SettingsList[] = [
  {
    link: "/settings/navbar",
    linkLabel: "Navbar Settings",
    isFinalized: false,
    progress: 0,
    notes: ""
  },
  {
    link: "/settings/leftsidebar",
    linkLabel: "LeftSidebar Settings",
    isFinalized: false,
    progress: 0,
    notes: ""
  }
];

export default function SettingsPage(): JSX.Element {
  return (
    <div className="p-6">
      <h1 className="text-6xl font-bold mb-4">User Interface Design Settings</h1>
      <p className="mb-6">Welcome to the main settings page.</p>
      
      <div className="space-y-4">
        {EXAMPLE_SETTINGS.map((setting) => (
          <SettingsCard
            key={setting.link}
            {...setting}
          />
        ))}
      </div>
    </div>
  );
}