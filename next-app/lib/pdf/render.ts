import { renderToBuffer } from '@react-pdf/renderer';

export async function renderPdfBuffer(doc: React.ReactElement): Promise<Buffer> {
  return renderToBuffer(doc);
}
