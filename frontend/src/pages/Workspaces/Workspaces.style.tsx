import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    workspaces__container: {
      maxWidth: 1000,
      height: 600,
      margin: 'auto',
      marginTop: 50,
    },
  })
);

export default useStyles;
