import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  darkModeButton: {
    textDecoration: 'none',
    color: '#fff',
  },
  title: {
    flexGrow: 1,
    color: '#fff',
    textDecoration: 'none',
  },
}));

export default useStyles;
