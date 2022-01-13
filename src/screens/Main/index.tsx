import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from 'src/types/navigation';
import CreateEmployer from '../CreateEmployer';
import Overview from '../Overview';
import Punches from '../Punches';
import Test from '../Test';

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

const Main = () => {
  return (
    <Navigator>
      <Screen
        name="Overview"
        component={Overview}
        options={{ title: 'Overview' }}
      />
      <Screen name="Punches" component={Punches} />
      <Screen
        name="Create Employer"
        component={CreateEmployer}
        options={{
          presentation: 'transparentModal',
          animation: 'fade_from_bottom',
        }}
      />
      <Screen name="Test" component={Test} options={{ headerShown: false }} />
    </Navigator>
  );
};

export default Main;
