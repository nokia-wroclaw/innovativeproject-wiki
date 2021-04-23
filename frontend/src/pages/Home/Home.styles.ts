import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  homeTitlePaper: {
    padding: 40,
    height: 200,
    width: 800,
    margin: '30px auto',
    fontSize: 180,
  },
  firstFeaturePaper: {
    padding: 40,
    height: 30,
    width: 350,
    margin: '30px auto',
    fontWeight: 'bold',
    fontSize: 40,
  },
  firstFeature: {
    color: '#0386D0',
    fontSize: 40,
  },
  secondFeature: {
    color: 'red',
    fontSize: 40,
  },
  thirdFeature: {
    color: 'grey',
    fontSize: 40,
  },
}));

export default useStyles;
