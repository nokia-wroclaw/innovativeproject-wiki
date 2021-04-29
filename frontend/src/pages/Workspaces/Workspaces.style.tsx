import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({

    paper: {
        display: 'flex',
        padding: 40,
        width: 1200,
        height: 630,
        margin: '30px auto',
        fontSize: 40,
        marginTop: 40,
      },

      nameTitle: {
        marginTop: 5,
        marginLeft: 235,
      },

      lastUpdateTitle: {
        marginTop: 5,
        marginLeft: 470,
      },

      workspacesContainer: {
        display: 'flex',
        marginLeft: -935,
        marginTop: 80,
      },

      workspaces: {
        display: 'flex',
        padding: 5,
        textAlign: 'center',
        width: 1000,
        height: 50,
        margin: `${theme.spacing(1)}px auto`,
        elevation: 10,
        background: '#F4F4F4',
      },

      nameWorkspace: {
        marginLeft: 80,
      },

      lastUpdateWorkspace: {
        marginLeft: 410,
      },

      pages: {
          marginLeft: -620,
          marginTop: 550,
      }

}));

export default useStyles;
