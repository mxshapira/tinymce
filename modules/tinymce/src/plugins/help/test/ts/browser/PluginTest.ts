import { Pipeline, Log } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { TinyLoader, TinyUi } from '@ephox/mcagar';

import HelpPlugin from 'tinymce/plugins/help/Plugin';
import Theme from 'tinymce/themes/silver/Theme';

import * as PluginAssert from '../module/PluginAssert';
import * as Selectors from '../module/Selectors';

UnitTest.asynctest('browser.plugin.PluginTest', (success, failure) => {

  Theme();
  HelpPlugin();

  TinyLoader.setup(function (editor, onSuccess, onFailure) {
    const ui = TinyUi(editor);

    Pipeline.async({},
      Log.steps('TBA', 'Help: Assert Help Plugin list contains Help', [
        ui.sClickOnToolbar('Click help button', Selectors.toolbarHelpButton),
        PluginAssert.sAssert(
          'Failed to find `Help` plugin',
          {
            'a:contains("Help")': 1
          },
          Selectors.dialog,
          Selectors.pluginsTab
        )
      ])
    , onSuccess, onFailure);
  }, {
    plugins: 'help',
    toolbar: 'help',
    theme: 'silver',
    statusbar: false,
    base_url: '/project/tinymce/js/tinymce',
  }, success, failure);
});
