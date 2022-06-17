import {
  HeaderBackButton,
  HeaderBackButtonProps,
} from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const BackButton = (props: HeaderBackButtonProps) => {
  const navigation = useNavigation();
  if (!props.canGoBack) {
    return;
  }

  return (
    <HeaderBackButton
      {...props}
      style={styles.base}
      onPress={() => navigation.goBack()}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    marginLeft: 0,
  },
});

export default BackButton;
