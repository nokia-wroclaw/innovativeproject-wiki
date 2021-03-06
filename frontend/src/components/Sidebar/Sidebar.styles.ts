import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      minWidth: 250,
      backgroundColor: 'rgba(52, 52, 52, 0.02)',
    },
    listName: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
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
    addDocFolderPopUp: {
      width: 220,
      height: 80,
    },
    toggleButton: {
      width: 10,
      height: 10,
      marginLeft: 10,
    },
  })
);

export default useStyles;
