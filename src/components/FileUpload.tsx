'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload } from 'lucide-react'

export function FileUpload({ onSummaryReceived }: { onSummaryReceived: (summary: string) => void }) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setIsUploading(true)
      setError(null) // Reset error state on new file selection

      const formData = new FormData()
      formData.append('file', file)

      try {
        // Optional: Validate file type before uploading
        const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error('Invalid file type. Please upload a .txt, .pdf, or .doc file.');
        }

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json()
        onSummaryReceived(data.summary)
      } catch (error) {
        console.error('Error uploading file:', error)
        setError('Error uploading file. Please try again.')
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <div className="flex flex-col items-start space-y-4">
      <div className="flex items-center space-x-4">
        <Input
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          disabled={isUploading}
        />
        <Button asChild disabled={isUploading}>
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload Document (.txt)'}
          </label>
        </Button>
        {fileName && <span className="text-sm text-muted-foreground">{fileName}</span>}
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
