import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { Item, QuarkusVersionList } from './QuarkusVersionList';
import userEvent from '@testing-library/user-event';

describe('Select', () => {

  const testLabel = 'Date Select';
  const testItems: Item[] = [
    { label: '3.8 (RECOMMENDED)', value: '3.8' },
    { label: '3.2', value: '3.2.Final' },
  ];

  const user = userEvent.setup();

  it('should render', async () => {
    const rendered = await renderInTestApp(
      <QuarkusVersionList
        value="3.8"
        items={testItems}
        label={testLabel}
        onChange={() => undefined}
      />,
    );
    expect(rendered.getAllByText(testLabel)).toHaveLength(2);
  });

  describe("when the user hasn't clicked on it", () => {
    it('should only render the current select item', async () => {
      const rendered = await renderInTestApp(
        <QuarkusVersionList
          value="3.8"
          items={testItems}
          label={testLabel}
          onChange={() => undefined}
        />,
      );
      expect(rendered.getByText(testItems[0].label)).toBeInTheDocument();
      expect(rendered.queryByText(testItems[1].label)).toBeNull();
    });
  });

  describe('when the user clicked on it', () => {
    it('should render all the items', async () => {
      const rendered = await renderInTestApp(
        <QuarkusVersionList
          value="3.8"
          items={testItems}
          label={testLabel}
          onChange={() => undefined}
        />,
      );
      user.tab();
      await userEvent.keyboard('{enter}');

      expect(rendered.getAllByText(testItems[0].label)).toHaveLength(2);
      expect(rendered.getByText(testItems[1].label)).toBeInTheDocument();
    });
  });
});
