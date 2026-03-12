import { marketplaceClient } from '@/lib/marketplaceClient';
import type { AccessProof, DatasetListing, MarketplaceFilter, PublishDatasetForm } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export function useMarketplace(filter?: MarketplaceFilter) {
  const qc = useQueryClient();
  const [publishProgress, setPublishProgress] = useState<{ pct: number; step: string } | null>(null);

  const { data: datasets = [], isLoading } = useQuery({
    queryKey: ['datasets', filter],
    queryFn: () => marketplaceClient.listDatasets(filter),
    staleTime: 30_000,
  });

  const { data: myListings = [] } = useQuery({
    queryKey: ['my-listings'],
    queryFn: () => marketplaceClient.getMyListings(),
  });

  const { data: myProofs = [] } = useQuery({
    queryKey: ['my-proofs'],
    queryFn: () => marketplaceClient.getMyProofs(),
  });

  const { data: stats } = useQuery({
    queryKey: ['market-stats'],
    queryFn: () => marketplaceClient.getStats(),
    staleTime: 60_000,
  });

  const publishMutation = useMutation<DatasetListing, Error, PublishDatasetForm>({
    mutationFn: (form) =>
      marketplaceClient.publishDataset(form, (pct: number, step: string) => setPublishProgress({ pct, step })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['datasets'] });
      qc.invalidateQueries({ queryKey: ['my-listings'] });
      qc.invalidateQueries({ queryKey: ['market-stats'] });
      setPublishProgress(null);
    },
    onError: () => setPublishProgress(null),
  });

  const purchaseMutation = useMutation<AccessProof, Error, string>({
    mutationFn: (datasetId) => marketplaceClient.purchaseAccess(datasetId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['datasets'] });
      qc.invalidateQueries({ queryKey: ['my-proofs'] });
    },
  });

  return {
    datasets,
    isLoading,
    myListings,
    myProofs,
    stats,
    publishProgress,
    publishDataset: publishMutation.mutateAsync,
    isPublishing: publishMutation.isPending,
    publishError: publishMutation.error,
    purchaseAccess: purchaseMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
    lastProof: purchaseMutation.data,
  };
}

export function useDataset(id: string) {
  return useQuery({
    queryKey: ['dataset', id],
    queryFn: () => marketplaceClient.getDatasetById(id) ?? null,
    enabled: !!id,
  });
}
