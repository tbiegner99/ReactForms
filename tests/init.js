import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
process.on('unhandledRejection', (err) => {
  console.error('Rejection', err);
});
