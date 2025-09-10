import React from 'react';

// To keep bundle size down, we're defining icons as simple SVG components.
// In a larger app, a library like lucide-react would be a good choice.

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const createIcon = (path: React.ReactNode) => {
  const IconComponent: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {path}
    </svg>
  );
  IconComponent.displayName = 'Icon';
  return IconComponent;
};

export const ChevronDown = createIcon(<path d="m6 9 6 6 6-6" />);
export const Lightbulb = createIcon(<><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></>);
export const Loader = createIcon(<path d="M21 12a9 9 0 1 1-6.219-8.56" />);
export const AlertTriangle = createIcon(<><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>);
export const CheckCircle = createIcon(<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>);
export const BrainCircuit = createIcon(<><path d="M12 5a3 3 0 1 0-5.993.25" /><path d="M18 12a3 3 0 1 0-4.007 2.49" /><path d="M5 19a3 3 0 1 0 1.993-5.25" /><path d="M12 12a3 3 0 1 0 5.993-.25" /><path d="M19 5a3 3 0 1 0-1.993 5.25" /><path d="M5 5a3 3 0 1 0 4.007-2.49" /><path d="M12 19a3 3 0 1 0 5.993-.25" /><path d="M21.25 10.75a.25.25 0 1 0 0-0.5" /><path d="M18 12a.25.25 0 1 1 .5 0" /><path d="M12.5 11.5a.25.25 0 1 1 .5 0" /><path d="M14.75 6.75a.25.25 0 1 0 0-0.5" /><path d="M19 5a.25.25 0 1 1 .5 0" /><path d="M12.5 17.5a.25.25 0 1 1 .5 0" /><path d="M14.75 19.25a.25.25 0 1 0 0-0.5" /><path d="M5 19a.25.25 0 1 1 .5 0" /><path d="M7.25 13.75a.25.25 0 1 0 0-0.5" /><path d="M5 5a.25.25 0 1 1 .5 0" /><path d="M7.25 8.25a.25.25 0 1 0 0-0.5" /><path d="M12 5a.25.25 0 1 1 .5 0" /><path d="M9 12a.25.25 0 1 0 0 .5" /><circle cx="12" cy="12" r="1" /><circle cx="5" cy="5" r="1" /><circle cx="19" cy="5" r="1" /><circle cx="5" cy="19" r="1" /><circle cx="19" cy="19" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /><circle cx="18" cy="12" r="1" /><circle cx="6" cy="12" r="1" /></>);
export const FileDown = createIcon(<><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="m15 15-3 3-3-3" /></>);
export const Printer = createIcon(<><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></>);
export const Share = createIcon(<><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></>);
export const Share2 = createIcon(<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></>);
export const Copy = createIcon(<><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>);
export const Link = createIcon(<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" /></>);
export const Settings = createIcon(<><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>);
export const BookOpen = createIcon(<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>);
export const Users = createIcon(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>);
export const Plus = createIcon(<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>);
export const Trash = createIcon(<><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></>);
export const Menu = createIcon(<><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></>);
export const X = createIcon(<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>);
export const Target = createIcon(<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>);
export const Filter = createIcon(<><polygon points="22 3 2 3 10 12 10 19 14 21 14 12 22 3" /></>);