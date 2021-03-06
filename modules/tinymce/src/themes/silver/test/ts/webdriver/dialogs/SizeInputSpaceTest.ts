import { ApproxStructure, Assertions, Chain, FocusTools, Logger, RealKeys, UiFinder } from '@ephox/agar';
import { GuiFactory, TestHelpers } from '@ephox/alloy';
import { UnitTest } from '@ephox/bedrock-client';
import { Optional } from '@ephox/katamari';

import { renderSizeInput } from 'tinymce/themes/silver/ui/dialog/SizeInput';
import TestProviders from '../../module/TestProviders';

UnitTest.asynctest('SizeInput <space> webdriver Test', (success, failure) => {

  TestHelpers.GuiSetup.setup(
    (_store, _doc, _body) => GuiFactory.build(
      renderSizeInput({
        name: 'dimensions',
        label: Optional.some('size'),
        constrain: true,
        disabled: false
      }, TestProviders)
    ),
    (_doc, _body, _gui, component, _store) => {
      const sAssertLockedStatus = (label: string, expected: boolean) => Logger.t(
        label,
        Chain.asStep(component.element, [
          UiFinder.cFindIn('.tox-lock'),
          Assertions.cAssertStructure(
            'Checking the state of the lock button. Should be: ' + expected,
            ApproxStructure.build((s, str, arr) => s.element('button', {
              classes: [ arr.has('tox-lock') ],
              attrs: {
                'aria-pressed': str.is(expected ? 'true' : 'false')
              }
            }))
          )
        ])
      );

      const sSendRealSpace = RealKeys.sSendKeysOn('.tox-lock', [
        // Space key
        RealKeys.text('\uE00D')
      ]);

      return [
        FocusTools.sSetFocus('Focus the constrain button', component.element, '.tox-lock'),
        sAssertLockedStatus('Initially: ', true),
        sSendRealSpace,
        sAssertLockedStatus('Firing space on a pressed button', false),
        sSendRealSpace,
        sAssertLockedStatus('Firing space on a non-pressed button', true)
      ];
    },
    success,
    failure
  );
});
