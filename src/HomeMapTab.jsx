
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Map from './components/map/Map';
import SearchBox from './components/map/SearchBox';
// import LocateMe from '@/components/LocateMe';
    import TabLayout from './navigation/tabs/TabLayout';
const HomeMapTab = () => {
  return (
    <View style={{ flex: 1 }}>

		<TabLayout/>
		</View>
  );
};

export default HomeMapTab;
