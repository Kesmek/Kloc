import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Punches from '../Punches';

const { Navigator, Screen } = createNativeStackNavigator();

const Main = () => {
  return (
    <Navigator>
      <Screen name="Punches" component={Punches} />
    </Navigator>
  );
};
