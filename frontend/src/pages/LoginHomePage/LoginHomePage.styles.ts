import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 400,
        marginTop: 100,
        margin: '30px auto',
      },
      media: {
        height: 300,
      },
      homepage__title: {
        marginTop: 30,
        margin: 20,
      },
      username: {
          color: '#57B894',
          fontWeight: 'bold',
      }
}));

export default useStyles;
