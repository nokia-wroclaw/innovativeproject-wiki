import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  homeTitlePaper: {
    display: 'flex',
    padding: 40,
    height: 200,
    width: 800,
    margin: '30px auto',
    fontSize: 180,
    background: 'rgba(52, 52, 52, 0.05)',
    borderRadius: 20,
    marginTop: 80,
  },

  featurePaper: {
    display: 'flex',
    padding: 40,
    height: 30,
    width: 345,
    margin: '30px auto',
    fontWeight: 'bold',
    fontSize: 40,
    background: 'rgba(52, 52, 52, 0.05)' ,
    borderRadius: 20,
  },

  penIcon: {
    color: '#0386D0',
    fontSize: 60,
    marginLeft: 10,
    marginTop: -10,
  },

  searchIcon: {
    color: 'red',
    fontSize: 60,
    marginTop: -10,
  },

  settingsIcon: {
    color: 'grey',
    fontSize: 60,
    marginLeft: -8,
    marginTop: -10,
  },

  demoButton:  {
    marginTop: 70,
  },

}));

export default useStyles;
