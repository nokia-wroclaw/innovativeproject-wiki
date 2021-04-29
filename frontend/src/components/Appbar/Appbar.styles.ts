import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    color: '#fff',
    textDecoration: 'none',
    float: 'left',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 0,
  },
}));

export default useStyles;
