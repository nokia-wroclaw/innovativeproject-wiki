import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

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
  })
);

export default useStyles;
