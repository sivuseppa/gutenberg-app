import { __ } from '@wordpress/i18n';
import { Button, Card, CardBody, TextControl, Dashicon, FormTokenField } from '@wordpress/components';
import { useState, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';

const RuleRows = ({ rules, updateState }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await apiFetch({
        path: '/wp/v2/categories',
      });
      //console.log(categories);
      // const categorySlugsObject = categories.reduce((acc, category) => {
      //   acc[category.name] = { slug: category.slug, name: category.name };
      //   return acc;
      // }, {});
      //console.log(categories);
      const categoryNameArr = categories.map((category) => category.name);
      console.log(categoryNameArr);
      setCategories(categoryNameArr);
    };
    fetchCategories().catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <div>
      {Object.entries(rules).map(([row, rule]) => (
        <Card key={row}>
          <CardBody>
            <div>{row}</div>

            <TextControl
              label={__('Product ID', 'wop')}
              help={__('This is a custom option field.', 'wop')}
              value={rule.id}
              onChange={(value) => updateState('update_field', row, 'id', value)}
            />

            <TextControl
              label={__('Rule 1', 'wop')}
              help={__('This is a custom option field.', 'wop')}
              value={rule.r1}
              //onChange={(value) => dispatch({ type: 'update_rule', row: row, r1: value })}
              onChange={(value) => updateState('update_field', row, 'r1', value)}
            />

            <FormTokenField
              label={__('Rule 2 Categories', 'wop')}
              onChange={(value) => updateState('update_field', row, 'r2', value)}
              suggestions={categories}
              value={rule.r2}
            />

            <Button variant='secondary' type='button' onClick={() => updateState('remove_rule', row)}>
              <Dashicon icon='trash' />
            </Button>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default RuleRows;
