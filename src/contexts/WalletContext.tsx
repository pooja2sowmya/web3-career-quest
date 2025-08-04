import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

declare global {
  interface Window {
    ethereum?: any
    solana?: any
  }
}

interface WalletContextType {
  isConnected: boolean
  walletAddress: string | null
  walletType: 'metamask' | 'phantom' | null
  connectMetaMask: () => Promise<void>
  connectPhantom: () => Promise<void>
  disconnect: () => void
  loading: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<'metamask' | 'phantom' | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if already connected
    const savedAddress = localStorage.getItem('walletAddress')
    const savedType = localStorage.getItem('walletType') as 'metamask' | 'phantom' | null
    
    if (savedAddress && savedType) {
      setWalletAddress(savedAddress)
      setWalletType(savedType)
      setIsConnected(true)
    }
  }, [])

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed')
    }

    try {
      setLoading(true)
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length > 0) {
        const address = accounts[0]
        setWalletAddress(address)
        setWalletType('metamask')
        setIsConnected(true)
        
        // Save to localStorage
        localStorage.setItem('walletAddress', address)
        localStorage.setItem('walletType', 'metamask')
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const connectPhantom = async () => {
    if (!window.solana?.isPhantom) {
      throw new Error('Phantom wallet not installed')
    }

    try {
      setLoading(true)
      const response = await window.solana.connect()
      
      if (response.publicKey) {
        const address = response.publicKey.toString()
        setWalletAddress(address)
        setWalletType('phantom')
        setIsConnected(true)
        
        // Save to localStorage
        localStorage.setItem('walletAddress', address)
        localStorage.setItem('walletType', 'phantom')
      }
    } catch (error) {
      console.error('Error connecting to Phantom:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setWalletAddress(null)
    setWalletType(null)
    
    // Clear localStorage
    localStorage.removeItem('walletAddress')
    localStorage.removeItem('walletType')
  }

  const value = {
    isConnected,
    walletAddress,
    walletType,
    connectMetaMask,
    connectPhantom,
    disconnect,
    loading,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}