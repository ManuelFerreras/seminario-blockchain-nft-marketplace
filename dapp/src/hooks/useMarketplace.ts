import { useAccount, useContractRead, useContractReads, useContractWrite, useWaitForTransaction } from 'wagmi'
import { marketplaceAbi, nftsAbi, tokenAbi } from '@/constants/abis.constants';
import { Listing, addressType } from '@/types/blockchain.types';

const useMarketplace = () => {
  const { address } = useAccount();

  const getMarkeplaceListings = () => {
    const { data, isError, isLoading } = useContractRead({
      address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as addressType,
      abi: marketplaceAbi,
      functionName: 'getAllActiveListings',
      watch: true
    })
    return { data, isError, isLoading };
  }

  const getNftMetadata = (tokenAddress: addressType, tokenId: number) => {
    const { data, isError, isLoading } = useContractRead({
      address: tokenAddress,
      abi: nftsAbi,
      functionName: 'tokenURI',
      args: [tokenId]
    })
    return { data, isError, isLoading };
  }

  const cancelNft = (listing: Listing) => {
    const { data, isLoading, isSuccess, write, writeAsync } = useContractWrite({
      address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as addressType,
      abi: marketplaceAbi,
      functionName: 'cancelListing',
      args: [listing.tokenAddress, listing.tokenId]
    })

    const waitTransaction = useWaitForTransaction({
      hash: data?.hash,
    })

    return { data, isLoading, isSuccess, write, writeAsync, waitTransaction };
  }

  const buyNft = (listing: Listing) => {
    const { data, isLoading, isSuccess, write, writeAsync } = useContractWrite({
      address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as addressType,
      abi: marketplaceAbi,
      functionName: 'buyItem',
      args: [listing.tokenAddress, listing.tokenId]
    })

    const waitTransaction = useWaitForTransaction({
      hash: data?.hash,
    })

    return { data, isLoading, isSuccess, write, writeAsync, waitTransaction };
  }

  const updateNft = () => {
    const { data, isLoading, isSuccess, write, writeAsync } = useContractWrite({
      address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as addressType,
      abi: marketplaceAbi,
      functionName: 'updateListing'
    })

    const waitTransaction = useWaitForTransaction({
      hash: data?.hash,
    })

    return { data, isLoading, isSuccess, write, writeAsync, waitTransaction };
  }

  const approveNft = (tokenAddress: addressType) => {
    const { data, isLoading, isSuccess, write, writeAsync } = useContractWrite({
      address: tokenAddress,
      abi: nftsAbi,
      functionName: 'approve'
    })

    const waitTransaction = useWaitForTransaction({
      hash: data?.hash,
    })

    return { data, isLoading, isSuccess, write, writeAsync, waitTransaction };
  }

  const approveToken = () => {
    const { data, isLoading, isSuccess, write, writeAsync } = useContractWrite({
      address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as addressType,
      abi: tokenAbi,
      functionName: 'approve'
    })

    const waitTransaction = useWaitForTransaction({
      hash: data?.hash,
    })

    return { data, isLoading, isSuccess, write, writeAsync, waitTransaction };
  }

  const getNftsBalance = () => {
    const { data, isError, isLoading } = useContractRead({
      address: process.env.NEXT_PUBLIC_NFTS_ADDRESS as addressType,
      abi: nftsAbi,
      functionName: 'balanceOf',
      args: [address]
    })
    return { data, isError, isLoading };
  }

  const getNftsData = (config: any) => {
    const { data, isError, isLoading } = useContractReads(config)

    return { data, isError, isLoading };
  }

  const getListingData = (listing: Listing) => {
    const { data, isError, isLoading } = useContractRead({
      address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as addressType,
      abi: marketplaceAbi,
      functionName: 'getListing',
      watch: true,
      args: [listing?.tokenAddress, listing?.tokenId]
    })

    return { data, isError, isLoading };
  }

  const listNft = () => {
    const { data, isLoading, isSuccess, write, writeAsync } = useContractWrite({
      address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as addressType,
      abi: marketplaceAbi,
      functionName: 'listItem'
    })

    const waitTransaction = useWaitForTransaction({
      hash: data?.hash,
    })

    return { data, isLoading, isSuccess, write, writeAsync, waitTransaction };
  }

  return { listNft, getListingData, getNftsData, getNftsBalance, getMarkeplaceListings, getNftMetadata, cancelNft, buyNft, updateNft, approveNft, approveToken };
};

export default useMarketplace;
