import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      minWidth: 250,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    inputContainer: {
      display: 'flex',
      height: 40,
      padding: 20,
    },
    fileItem: {
      textDecoration: 'none',
      color: 'black',
    },
  })
);

export default useStyles;
