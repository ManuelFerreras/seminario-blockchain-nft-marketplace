"use client";
import { WagmiConfig, createConfig, sepolia } from 'wagmi'
import { createPublicClient, http } from 'viem'

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: sepolia,
    transport: http()
  }),
})

export default function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiConfig config={config}>
      {children}
    </WagmiConfig>
  )
}
