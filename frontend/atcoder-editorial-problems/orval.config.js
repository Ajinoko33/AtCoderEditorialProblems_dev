module.exports = {
  'atcoder-editorial-problems': {
    input: {
      target: '../../openapi/v1/output/openapi.yml',
    },
    output: {
      mode: 'tags-split',
      client: 'react-query',
      target: './src/generated/orval/endpoints',
      schemas: './src/generated/orval/models',
      prettier: true,
      override: {
        useQuery: true,
        mutator: {
          path: './src/config/axios.ts',
          name: 'customInstance',
        },
      },
    },
  },
};
