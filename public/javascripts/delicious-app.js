import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './autocomplete';

autocomplete($('#address'), $('#lat'), $('#lng'));