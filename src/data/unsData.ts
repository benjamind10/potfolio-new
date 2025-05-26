export type UnsNode = {
  name: string;
  fullPath: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  children?: UnsNode[];
};

export const unsData: UnsNode = {
  name: 'Enterprise',
  fullPath: 'Enterprise',
  children: [
    {
      name: 'Richmond',
      fullPath: 'Enterprise/Richmond',
      children: [
        {
          name: 'Press',
          fullPath: 'Enterprise/Richmond/Press',
          children: [
            {
              name: 'Line1',
              fullPath: 'Enterprise/Richmond/Press/Line1',
              payload: {
                OEE: 0.8565,
                Availability: 0.92,
                Quality: 0.98,
                Performance: 0.95,
              },
            },
          ],
        },
      ],
    },
  ],
};
