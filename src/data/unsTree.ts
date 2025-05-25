export const unsTree = {
  name: 'factory',
  children: [
    {
      name: 'line1',
      children: [
        {
          name: 'machine1',
          children: [
            { name: 'state' },
            { name: 'infeed' },
            { name: 'outfeed' },
          ],
        },
        {
          name: 'machine2',
          children: [{ name: 'state' }],
        },
      ],
    },
  ],
};
