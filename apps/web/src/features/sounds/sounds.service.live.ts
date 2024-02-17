import { SoundsService } from '@features/sounds/sounds.service';
import { api } from '@providers/api/api.client';
import { ApiProviderError } from '@providers/api/api.errors';
import { Layer, Effect } from 'effect';

export const SoundsServiceLive = Layer.succeed(SoundsService, {
  getAll: () => {
    return Effect.tryPromise({
      try: async () => {
        return api.sounds
          .$get({
            query: {
              author: '',
              name: '',
            },
          })
          .then((response) => response.json());
      },
      catch: () => new ApiProviderError(),
    });
  },
});
