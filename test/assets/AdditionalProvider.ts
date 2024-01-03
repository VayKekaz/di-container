import { Provider } from '../../src';
import { BaseProvider } from './BaseProvider';
import { AdditionalScope } from './scopes';


// @ts-ignore for some reason experimentalDecorators option does not work here
@Provider(AdditionalScope)
export class AdditionalProvider extends BaseProvider {
}
