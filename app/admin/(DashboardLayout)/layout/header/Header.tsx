import { DashboardContext } from '@/app/context/DashboardContext';
import { AppBar, Box, IconButton, Stack, Toolbar, styled } from '@mui/material';
import PropTypes from 'prop-types';
import { useContext } from 'react';
// components
import { IconMenu2 } from '@tabler/icons-react';
import Notification from './Notification';
import Profile from './Profile';



const Header = () => {



  const { isMobileSidebar, setIsMobileSidebar } = useContext(DashboardContext);
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
    zIndex: 'unset'
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={() => setIsMobileSidebar(!isMobileSidebar)}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu2 width="20" height="20" />
        </IconButton>

        <Notification />

        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;


