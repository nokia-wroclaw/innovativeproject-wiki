import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    filePageContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    sidebar: {
      margin: 40,
    },
    editor: {
      margin: 40,
    },
    filePage_buttons: {
      marginTop: 30,
      margin: theme.spacing(1),
      }
  }));

  export default useStyles;
