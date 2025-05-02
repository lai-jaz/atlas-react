
import { Link } from 'react-router-dom';
import { Book, Map, Users, MapPin, User, Settings } from 'lucide-react';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

const Sidebar = () => {
  const navigationItems = [
    {
      title: 'Feed',
      icon: <Book className="h-5 w-5" />,
      link: '/',
    },
    {
      title: 'Explore Map',
      icon: <Map className="h-5 w-5" />,
      link: '/map',
    },
    {
      title: 'My Journal',
      icon: <MapPin className="h-5 w-5" />,
      link: '/journal',
    },
    {
      title: 'Roammates',
      icon: <Users className="h-5 w-5" />,
      link: '/roammates',
    },
  ];

  const accountItems = [
    {
      title: 'Profile',
      icon: <User className="h-5 w-5" />,
      link: '/profile',
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      link: '/settings',
    },
  ];

  return (
    <SidebarComponent>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <MapPin className="h-6 w-6 text-sidebar-primary" />
          <span className="font-bold text-lg">Atlas</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.link} className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarMenu>
            {accountItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.link} className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-3 py-2">
          <p className="text-xs text-sidebar-foreground/70">Atlas Travel Platform</p>
          <p className="text-xs text-sidebar-foreground/50">© 2025 Atlas</p>
        </div>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
