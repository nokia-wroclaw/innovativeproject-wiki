import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  loginPaper: {
    padding: 40,
    height: 360,
    width: 300,
    margin: '30px auto',
  },
  loginTextField: {
    margin: '15px auto',
  },
  loginButton: { margin: '30px auto' },
}));

export default useStyles;
