import { __ } from '@wordpress/i18n';
import { useState, useEffect, useReducer } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Card, CardBody, TextControl, Snackbar, Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

const OptionsPage = () => {
  const [customField, setCustomField] = useState('');
  //onst [customFieldsObject, setCustomFieldsObject] = useState({});
  const initialState = {
    settings: {},
    rules: {
      // 1: { id: 123, r1: 'moikka' },
      // 2: { id: 144, r1: 'morr' },
      // 3: { id: 345, r1: 'wgggg' },
      // 4: { id: 679, r1: 'moikka' },
      // 5: { id: 732, r1: 'plööö' },
      // 6: { id: 277, r1: 'moikka' },
    },
  };
  //const [state, updateState] = useReducer((state, updates) => ({ ...state, ...updates }), initialState);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hideSpinner, setHideSpinner] = useState(false);
  const [hideForm, setHideForm] = useState(true);

  function reducer(state, action) {
    switch (action.type) {
      case 'init': {
        return action.state;
      }
      case 'update_id': {
        return {
          ...state,
          rules: {
            ...state.rules,
            [action.row]: {
              ...state.rules[action.row],
              id: action.id,
            },
          },
        };
      }
      case 'update_rule': {
        return {
          ...state,
          rules: {
            ...state.rules,
            [action.row]: {
              ...state.rules[action.row],
              r1: action.r1,
            },
          },
        };
      }
      case 'add_rule': {
        return {
          ...state,
          rules: {
            ...state.rules,
            [Object.keys(state.rules).length + 1]: { id: '', r1: '' },
          },
        };
      }
      case 'remove_rule': {
        delete state.rules[action.row];
        return {
          ...state,
        };
      }
    }
    //return { ...state, ...updates };
  }

  useEffect(() => {
    const fetchSettings = async () => {
      const { wop_custom_field } = await apiFetch({
        path: '/wp/v2/settings?_fields=wop_custom_field',
      });
      // const { wop_object } = await apiFetch({
      //   path: '/wp/v2/settings?_fields=wop_object',
      // });
      const { wop_custom_field_2 } = await apiFetch({
        path: '/wp/v2/settings?_fields=wop_custom_field_2',
      });
      setCustomField(wop_custom_field);
      //updateState({ setting_1: wop_object?.setting_1, setting_2: wop_object?.setting_2 });
      let wop_state;
      if (wop_custom_field_2) {
        wop_state = JSON.parse(wop_custom_field_2);
      } else {
        wop_state = initialState;
      }

      dispatch({ type: 'init', state: wop_state });
      setHideSpinner(true);
      setHideForm(false);

      console.log(state);
    };
    fetchSettings().catch((error) => {
      console.error(error);
    });
  }, []);

  const [visibility, setVisibility] = useState('hidden');

  const MySnackbarNotice = () => {
    return <Snackbar className={visibility}>Settings saved successfully.</Snackbar>;
  };

  const handleSubmit = async (event) => {
    setHideSpinner(false);
    event.preventDefault();
    console.log(state);
    const { wop_custom_field } = await apiFetch({
      path: '/wp/v2/settings',
      method: 'POST',
      data: {
        wop_custom_field: customField,
      },
    });
    // const { wop_object } = await apiFetch({
    //   path: '/wp/v2/settings',
    //   method: 'POST',
    //   data: {
    //     wop_object: {
    //       setting_1: state.setting_1,
    //       setting_2: state.setting_2,
    //     } /*customFieldsObject*/,
    //   },
    // });
    const wop_state = JSON.stringify(state);
    const { wop_custom_field_2 } = await apiFetch({
      path: '/wp/v2/settings',
      method: 'POST',
      data: {
        wop_custom_field_2: wop_state,
      },
    });
    setVisibility('');
    setTimeout(() => {
      setVisibility('hidden');
    }, 3000);
    setHideSpinner(true);
    //setCustomField(wop_custom_field);
    //setCustomFieldsObject(wop_custom_fields_object);
    //updateState({ setting_1: wop_custom_fields_object?.setting_1, setting_2: wop_custom_fields_object?.setting_2 });
  };

  return (
    <div>
      <h1>{__('Options Page', 'wop')}</h1>
      <div hidden={hideSpinner}>
        <Spinner />
      </div>
      <form onSubmit={handleSubmit} hidden={hideForm}>
        <Card>
          <CardBody>
            <TextControl
              label={__('Custom Option Field', 'wop')}
              help={__('This is a custom option field.', 'wop')}
              value={customField}
              onChange={setCustomField}
            />
          </CardBody>
        </Card>
        <br />
        {Object.entries(state.rules).map(([row, rule]) => (
          <Card key={row}>
            <div>{row}</div>
            <CardBody>
              <TextControl
                label={__('Product ID', 'wop')}
                help={__('This is a custom option field.', 'wop')}
                value={rule.id}
                onChange={(value) => dispatch({ type: 'update_id', row: row, id: value })}
              />
              <TextControl
                label={__('Product Category rule', 'wop')}
                help={__('This is a custom option field.', 'wop')}
                value={rule.r1}
                onChange={(value) => dispatch({ type: 'update_rule', row: row, r1: value })}
              />
              <Button variant='primary' type='button' onClick={() => dispatch({ type: 'remove_rule', row: row })}>
                {__('-', 'wop')}
              </Button>
            </CardBody>
          </Card>
        ))}
        <br />
        <div>
          <Button variant='primary' type='button' onClick={(value) => dispatch({ type: 'add_rule' })}>
            {__('+', 'wop')}
          </Button>
        </div>
        <br />
        <Card>
          <CardBody>
            <TextControl
              label={__('Custom Object Option Field "Saving as an object"', 'wop')}
              help={__('This is a custom option field.', 'wop')}
              value={state.setting_2?.sub_object}
              onChange={'moikka'}
            />
          </CardBody>
        </Card>
        <Button variant='primary' type='submit'>
          {__('Save', 'wop')}
        </Button>
      </form>
      <MySnackbarNotice />
    </div>
  );
};

window.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('my-first-gutenberg-app');

  if (rootElement) {
    createRoot(rootElement).render(<OptionsPage />);
  } else {
    console.error('Root element not found.');
  }
});
