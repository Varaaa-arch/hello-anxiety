export const generateStrukHTML = (
  queueNumber: string,
  items?: { name: string; qty: number; price: number }[],
  total?: number
) => {
  let itemsHtml = '';
  if (items && items.length > 0) {
    itemsHtml = items.map(item => `
      <tr>
        <td>${item.name}</td>
        <td style="text-align:center;">${item.qty}</td>
        <td style="text-align:right;">Rp ${item.price.toLocaleString()}</td>
      </tr>
    `).join('');
  }

  return `
    <div style="font-family:sans-serif; padding:20px;">
      <h2 style="text-align:center;">Order Berhasil!</h2>
      <p style="text-align:center;">Nomor Antrian: <strong>${queueNumber}</strong></p>
      <table style="width:100%; border-collapse: collapse; margin-top:20px;">
        <thead>
          <tr>
            <th style="text-align:left;">Item</th>
            <th style="text-align:center;">Qty</th>
            <th style="text-align:right;">Harga</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      ${total ? `<p style="text-align:right; font-weight:bold; margin-top:10px;">Total: Rp ${total.toLocaleString()}</p>` : ''}
      <p style="text-align:center; margin-top:20px;">Terima kasih telah memesan!</p>
    </div>
  `;
};
