import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Users from './user/Users';
import Articles from './article/Articles';

const Page = () => {
  // État pour suivre le composant actuel à afficher
  const [activeComponent, setActiveComponent] = useState('users');

  // Fonction pour changer le composant actif
  const handleMenuItemClick = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '250px' }}> {/* Réglage de la largeur de la barre latérale */}
        <Sidebar>
          <Menu>
            <SubMenu label="Charts">
              <MenuItem onClick={() => handleMenuItemClick('pieChart')}> Pie charts </MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('lineChart')}> Line charts </MenuItem>
            </SubMenu>
            <MenuItem onClick={() => handleMenuItemClick('documentation')}> Documentation </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('calendar')}> Calendar </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('users')}> User </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('articles')}> Article </MenuItem>
          </Menu>
        </Sidebar>
      </div>
      <div style={{ flex: 1 }}>
        {activeComponent === 'users' && <Users />}
        {activeComponent === 'articles' && <Articles />}
        {/* Ajouter d'autres conditions pour d'autres composants si nécessaire */}
      </div>
    </div>
  );
}

export default Page;
