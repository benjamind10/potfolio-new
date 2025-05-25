export type UnsNode = {
  name: string;
  fullPath: string;
  payload?: unknown;
  children?: UnsNode[];
};

export const unsData: UnsNode = {
  name: 'Enterprise',
  fullPath: 'Enterprise',
  children: [
    {
      name: 'Dallas',
      fullPath: 'Enterprise/Dallas',
      children: [
        {
          name: 'Press',
          fullPath: 'Enterprise/Dallas/Press',
          children: [
            {
              name: 'Line1',
              fullPath: 'Enterprise/Dallas/Press/Line1',
              payload: { OEE: 0.94, Availability: 0.92 },
            },
          ],
        },
      ],
    },
  ],
};
