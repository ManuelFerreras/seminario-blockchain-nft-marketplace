import { useContractRead } from 'wagmi'
import { marketplaceAbi, nftsAbi } from '@/constants/abis.constants';
import { addressType } from '@/types/blockchain.types';

const useMarketplace = () => {
  const getMarkeplaceListings = () => {
    const { data, isError, isLoading } = useContractRead({
      address: '0x668eefcf257d76c78f65d351BF799029295cE40B',
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

  return { getMarkeplaceListings, getNftMetadata };
};

export default useMarketplace;
