import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    textDecoration: 'none',
  },
  buttons: {},
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: '40%',
    marginRight: 8,
  },
}));

export default useStyles;
