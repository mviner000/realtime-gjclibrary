"use client"

import DecryptionForm from '@/components/auth/crypt/DecryptionForm'
import EncryptionForm from '@/components/auth/crypt/EncryptionForm'
import { Separator } from '@/components/ui/separator'
import React from 'react'

const CryptPage = () => {
  return (
        <div className="w-full max-w-md mx-auto space-y-5 my-10">
      <EncryptionForm />
      <Separator />
      <DecryptionForm />
    </div>
  )
}

export default CryptPage