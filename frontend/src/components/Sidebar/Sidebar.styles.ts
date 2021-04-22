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
  })
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const useStyles = (props: any) =>
//   makeStyles((theme) => ({
//     root: {
//       width: '100%',
//       maxWidth: 200,
//       backgroundColor: theme.palette.background.paper,
//     },
//     nested: {
//       paddingLeft: theme.spacing(props?.level),
//     },
//     inputContainer: {
//       display: 'flex',
//       height: 40,
//       padding: 20,
//     },
//   }));

export default useStyles;
