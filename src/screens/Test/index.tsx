import { StyleSheet, View } from 'react-native';
import RippleButton from 'src/Components/RippleButton';
import { colors } from 'src/utils/constants';

const Test = () => {
  return (
    <View style={styles.root}>
      <RippleButton>
        <View style={styles.bigView} />
        <View style={styles.bigView} />
      </RippleButton>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  bigView: {
    width: '70%',
    marginLeft: 100,
    aspectRatio: 1,
    backgroundColor: colors.PRIMARY_GREEN,
    marginBottom: 10,
  },
});

export default Test;
