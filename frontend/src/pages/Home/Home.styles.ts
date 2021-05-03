import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  homepage__title: {
    margin: 20,
  },
  homepage__subtitle: {
    marginBottom: 40,
  },
  homepage__cards: {
    // display: 'flex',
    // flexDirection: 'row',
    //     justifyContent: 'space-around',
  },
  homepage__card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 50,
  },
  homepage__undraw: {
    width: 500,
  },
  homepage__buttons: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 30,
  },
  homepage__button: {
    margin: 20,
  },
}));

export default useStyles;
