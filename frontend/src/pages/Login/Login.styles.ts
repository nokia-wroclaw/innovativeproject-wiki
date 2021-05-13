import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  loginPaper: {
    padding: 40,
    minHeight: 380,
    width: 300,
    margin: '30px auto',
  },
  loginTextField: {
    margin: '15px auto',
  },
  
  add_dialog: {
    margin: 'auto',
    marginTop: 30,
    marginRight: 40,
  },

  loginButton: { margin: '30px auto' },
  errorMessage: { marginTop: 20, width: '100%' },
}));

export default useStyles;
