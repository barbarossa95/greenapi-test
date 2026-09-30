import {PropsWithChildren, useEffect} from 'react';
import {QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

import {selectIsInstanceSet, useInstanceStore} from '@/entities';
import {SelectInstanceModal} from '@/features/selectInstance';
import {useDisclosure} from '@/shared';

import {queryClient} from './queryClient';

export const TanstackQueryProvider = ({children}: PropsWithChildren) => {
  const isInstanceSet = useInstanceStore(selectIsInstanceSet);
  const [opened, {open, close}] = useDisclosure();

  useEffect(() => {
    if (!isInstanceSet) {
      open();
    }
  }, [isInstanceSet, open]);

  return (
    <QueryClientProvider client={queryClient}>
      <SelectInstanceModal open={opened} onClose={() => close()} />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
