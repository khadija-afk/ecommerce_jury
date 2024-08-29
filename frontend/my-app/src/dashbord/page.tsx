import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Users from './user/Users';  // Assurez-vous que ce chemin est correct
import Articles from './article/Articles';  // Assurez-vous que ce chemin est correct

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

export default function ResponsiveDrawer(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeComponent, setActiveComponent] = React.useState('users');  // État pour le composant actif
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);  // État pour l'index sélectionné

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuItemClick = (component: string, index: number) => {
    setActiveComponent(component);
    setSelectedIndex(index);
  };

  const drawerContent = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['profile admin', 'utilisateurs', 'articles'].map((text, index) => (
          <ListItem
            key={text}
            style={selectedIndex === index ? { backgroundColor: 'white' } : {}}
          >
            <ListItemButton onClick={() => handleMenuItemClick(text.toLowerCase(), index)}>
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <InboxIcon style={selectedIndex === index ? { color: 'white' } : {}} />
                ) : (
                  <MailIcon style={selectedIndex === index ? { color: 'white' } : {}} />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Responsive Drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* 
          Use the temporary variant to display a drawer for small screens
          and persistent for a drawer for wider screens.
        */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { sm: 'none' },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
            display: { xs: 'none', sm: 'block' }, // Show only on larger screens
          }}
          variant="persistent"
          anchor="left"
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {activeComponent === 'utilisateurs' && <Users />}
        {activeComponent === 'articles' && <Articles />}
      </Box>
    </Box>
  );
}
