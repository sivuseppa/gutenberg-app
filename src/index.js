import { __ } from '@wordpress/i18n';
import { useState, useEffect, useReducer } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Card, CardBody, TextControl, Snackbar, Spinner } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

import RuleRows from './ruleRows';

const OptionsPage = () => {
  const initialState = {
    settings: {},
    rules: {},
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  function reducer(state, action) {
    //console.log(action.state);
    console.log(action);
    switch (action.type) {
      case 'init': {
        return action.state;
      }
      case 'update_field': {
        return {
          ...state,
          rules: {
            ...state.rules,
            [action.row]: {
              ...state.rules[action.row],
              [action.field]: action.value,
            },
          },
        };
      }
      case 'add_rule': {
        return {
          ...state,
          rules: {
            ...state.rules,
            [Object.keys(state.rules).length + 1]: { id: '', r1: '', r2: [], r3: '' },
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
  }

  useEffect(() => {
    const fetchSettings = async () => {
      const { wop_custom_field_2 } = await apiFetch({
        path: '/wp/v2/settings?_fields=wop_custom_field_2',
      });
      //console.log(wop_custom_field_2);
      let wop_state;
      if (wop_custom_field_2) {
        wop_state = JSON.parse(wop_custom_field_2);
      } else {
        wop_state = initialState;
      }

      initState(wop_state);
      //console.log(state);
    };
    fetchSettings().catch((error) => {
      console.error(error);
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    //console.log(state);

    const wop_state = JSON.stringify(state);
    const { wop_custom_field_2 } = await apiFetch({
      path: '/wp/v2/settings',
      method: 'POST',
      data: {
        wop_custom_field_2: wop_state,
      },
    });
  };

  const initState = (state) => {
    dispatch({ type: 'init', state: state });
  };

  const updateState = (type, row = null, field = null, value = null) => {
    dispatch({ type: type, row: row, field: field, value: value });
  };

  return (
    <div>
      <h1>{__('Options Page', 'wop')}</h1>
      <form onSubmit={handleSubmit}>
        <br />
        <RuleRows rules={state.rules} updateState={updateState} />
        <br />
        <div>
          <Button variant='primary' type='button' onClick={() => updateState('add_rule')}>
            {__('+', 'wop')}
          </Button>
        </div>
        <br />
        <Button variant='primary' type='submit'>
          {__('Save', 'wop')}
        </Button>
      </form>
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
