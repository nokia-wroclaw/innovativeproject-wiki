import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    workspaces__container: {
      maxWidth: 1000,
      height: 600,
      margin: 'auto',
      marginTop: 20,
    },

    add_dialog: {
      margin: 'auto',
      marginTop: 30,
      marginRight: 40,
    },

    addWorkspacePopUp: {
      width: 300,
      height: 60,
    },

    settingsWorkspacePopUp: {
      width: 500,
      height: 400,
    },

    settingsTable: {
      marginTop: -320,
      height: 300,
    },

    settingsDialog: {
      minWidth: '800px',
    },

    buttonAddOwner: {
      width: 150,
      marginTop: -680,
      marginLeft: 170,
    },
  })
);

export default useStyles;
