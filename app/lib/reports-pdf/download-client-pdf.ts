import { Document, pdf } from '@react-pdf/renderer'
import { format } from 'date-fns'
import type { ComponentProps, ReactElement } from 'react'
import { toast } from 'sonner'

type ReportPdfDocumentElement = ReactElement<ComponentProps<typeof Document>>

/**
 * Renders a @react-pdf/renderer `<Document>` tree in the browser and triggers a file download.
 */
export async function downloadClientPdf(
  pdfElement: ReportPdfDocumentElement,
  fileNameStem: string,
): Promise<void> {
  try {
    const blob = await pdf(pdfElement).toBlob()
    const stamp = format(new Date(), 'yyyy-MM-dd-HHmm')
    const name = `${fileNameStem}-${stamp}.pdf`
    const url = URL.createObjectURL(blob)
    const anchor = window.document.createElement('a')
    anchor.href = url
    anchor.download = name
    window.document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    toast.success('PDF downloaded')
  } catch (err) {
    console.error(err)
    toast.error('Could not generate PDF')
  }
}
