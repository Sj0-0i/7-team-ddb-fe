'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { BottomNavigationItem } from './BottomNavigationItem';
import { navigationItems } from './navigation-config';

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeItem, setActiveItem] = useState('/');

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  const handleClick = (href: string) => {
    setActiveItem(href);
    router.push(href);
  };

  return (
    <nav className="fixed bottom-0 z-10 h-20 w-full max-w-[430px] min-w-[375px] border-t border-gray-200 bg-white">
      <ul className="flex h-full items-center justify-between px-6">
        {navigationItems.map((item) => (
          <BottomNavigationItem
            key={item.href}
            item={item}
            isActive={activeItem === item.href}
            onClick={() => handleClick(item.href)}
          />
        ))}
      </ul>
    </nav>
  );
}
