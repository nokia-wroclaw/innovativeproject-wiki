import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    width: 700,
    height: 550,
    marginTop: 50,
    padding: 30,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  photoAndDataContainer: {
    marginTop: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 280,
    width: 600,
  },
  photoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
  },
  profilePicture: {
    height: 200,
    width: 200,
    boxShadow: '5px 10px 18px #888888',
    borderRadius: '40%',
  },
  dataContainer: {
    height: 200,
    width: 250,
    paddingBottom: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  passwordsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 60,
    marginBottom: 40,
    width: 600,
  },
  textField: {
    width: 250,
  },
  button: {
    width: 150,
  },
}));

export default useStyles;
