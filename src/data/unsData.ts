export type UnsNode = {
  name: string;
  fullPath: string;
  imageUrl?: string;
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
              children: [
                {
                  name: 'Machine1',
                  fullPath: 'Enterprise/Richmond/Press/Line1/Machine1',
                  imageUrl:
                    'https://placehold.co/400x200/1f2937/6366f1?text=Line1+Machine1',
                  payload: {
                    OEE: 0.8565,
                    Availability: 0.92,
                    Quality: 0.98,
                    Performance: 0.95,
                  },
                },
                {
                  name: 'Machine2',
                  fullPath: 'Enterprise/Richmond/Press/Line1/Machine2',
                  imageUrl:
                    'https://placehold.co/400x200/1f2937/6366f1?text=Line1+Machine2',
                  payload: {
                    OEE: 0.7912,
                    Availability: 0.88,
                    Quality: 0.96,
                    Performance: 0.94,
                  },
                },
              ],
            },
            {
              name: 'Line2',
              fullPath: 'Enterprise/Richmond/Press/Line2',
              children: [
                {
                  name: 'Machine1',
                  fullPath: 'Enterprise/Richmond/Press/Line2/Machine1',
                  imageUrl:
                    'https://placehold.co/400x200/1f2937/6366f1?text=Line2+Machine1',
                  payload: {
                    OEE: 0.9102,
                    Availability: 0.95,
                    Quality: 0.99,
                    Performance: 0.97,
                  },
                },
                {
                  name: 'Machine2',
                  fullPath: 'Enterprise/Richmond/Press/Line2/Machine2',
                  imageUrl:
                    'https://placehold.co/400x200/1f2937/6366f1?text=Line2+Machine2',
                  payload: {
                    OEE: 0.8234,
                    Availability: 0.91,
                    Quality: 0.95,
                    Performance: 0.95,
                  },
                },
              ],
            },
            {
              name: 'Line3',
              fullPath: 'Enterprise/Richmond/Press/Line3',
              children: [
                {
                  name: 'Machine1',
                  fullPath: 'Enterprise/Richmond/Press/Line3/Machine1',
                  imageUrl:
                    'https://placehold.co/400x200/1f2937/6366f1?text=Line3+Machine1',
                  payload: {
                    OEE: 0.7645,
                    Availability: 0.85,
                    Quality: 0.97,
                    Performance: 0.93,
                  },
                },
                {
                  name: 'Machine2',
                  fullPath: 'Enterprise/Richmond/Press/Line3/Machine2',
                  imageUrl:
                    'https://placehold.co/400x200/1f2937/6366f1?text=Line3+Machine2',
                  payload: {
                    OEE: 0.8891,
                    Availability: 0.93,
                    Quality: 0.98,
                    Performance: 0.98,
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'Assembly',
          fullPath: 'Enterprise/Richmond/Assembly',
          children: [
            {
              name: 'Line1',
              fullPath: 'Enterprise/Richmond/Assembly/Line1',
              children: [
                {
                  name: 'Station1',
                  fullPath: 'Enterprise/Richmond/Assembly/Line1/Station1',
                  imageUrl:
                    'https://placehold.co/400x200/1f2937/6366f1?text=Line1+Station1',
                  payload: {
                    OEE: 0.8312,
                    Availability: 0.9,
                    Quality: 0.97,
                    Performance: 0.95,
                  },
                },
                {
                  name: 'Station2',
                  fullPath: 'Enterprise/Richmond/Assembly/Line1/Station2',
                  imageUrl:
                    'https://placehold.co/400x200/1f2937/6366f1?text=Line1+Station2',
                  payload: {
                    OEE: 0.7756,
                    Availability: 0.87,
                    Quality: 0.95,
                    Performance: 0.94,
                  },
                },
              ],
            },
            {
              name: 'Line2',
              fullPath: 'Enterprise/Richmond/Assembly/Line2',
              children: [
                {
                  name: 'Station1',
                  fullPath: 'Enterprise/Richmond/Assembly/Line2/Station1',
                  imageUrl:
                    'https://placehold.co/400x200/1f2937/6366f1?text=Line2+Station1',
                  payload: {
                    OEE: 0.8978,
                    Availability: 0.94,
                    Quality: 0.99,
                    Performance: 0.96,
                  },
                },
                {
                  name: 'Station2',
                  fullPath: 'Enterprise/Richmond/Assembly/Line2/Station2',
                  imageUrl:
                    'https://placehold.co/400x200/1f2937/6366f1?text=Line2+Station2',
                  payload: {
                    OEE: 0.8123,
                    Availability: 0.89,
                    Quality: 0.96,
                    Performance: 0.95,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
