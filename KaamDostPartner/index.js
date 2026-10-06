import { AppRegistry } from 'react-native';
import PartnerApp from './App';
import CustomerApp from '../KaamDostCustomer/App';

AppRegistry.registerComponent('KaamDostPartner', () => PartnerApp);
AppRegistry.registerComponent('KaamDostCustomer', () => CustomerApp);
