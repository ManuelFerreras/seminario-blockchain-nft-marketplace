import { useContractRead, useContractWrite } from 'wagmi'
import { marketplaceAbi, nftsAbi, tokenAbi } from '@/constants/abis.constants';
import { Listing, addressType } from '@/types/blockchain.types';

const useMarketplace = () => {
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
    const { data, isLoading, isSuccess, write } = useContractWrite({
      address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as addressType,
      abi: marketplaceAbi,
      functionName: 'cancelListing',
      args: [listing.tokenAddress, listing.tokenId]
    })

    return { data, isLoading, isSuccess, write };
  }

  const buyNft = (listing: Listing) => {
    const { data, isLoading, isSuccess, write } = useContractWrite({
      address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as addressType,
      abi: marketplaceAbi,
      functionName: 'buyItem',
      args: [listing.tokenAddress, listing.tokenId]
    })

    return { data, isLoading, isSuccess, write };
  }

  const updateNft = (listing: Listing, newPrice: number) => {
    const { data, isLoading, isSuccess, write } = useContractWrite({
      address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as addressType,
      abi: marketplaceAbi,
      functionName: 'updateListing',
      args: [listing.tokenAddress, listing.tokenId, newPrice]
    })

    return { data, isLoading, isSuccess, write };
  }

  const approveNft = (tokenAddress: addressType, approver: addressType, tokenId: number) => {
    const { data, isLoading, isSuccess, write } = useContractWrite({
      address: tokenAddress,
      abi: nftsAbi,
      functionName: 'approve',
      args: [approver, tokenId]
    })

    return { data, isLoading, isSuccess, write };
  }

  const approveToken = (spender: addressType, amount: number) => {
    const { data, isLoading, isSuccess, write } = useContractWrite({
      address: process.env.NEXT_PUBLIC_TOKEN_ADDRESS as addressType,
      abi: tokenAbi,
      functionName: 'approve',
      args: [spender, amount]
    })

    return { data, isLoading, isSuccess, write };
  }

  return { getMarkeplaceListings, getNftMetadata, cancelNft, buyNft, updateNft, approveNft, approveToken };
};

export default useMarketplace;
