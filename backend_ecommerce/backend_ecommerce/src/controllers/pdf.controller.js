import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// API pour générer et télécharger la facture
export const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Récupérer les détails de la commande depuis la base de données
    const order = await OrderDetails.findOne({
      where: { id: orderId },
      include: [{ model: OrderItems, include: [Article] }],
    });

    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    // Créer un document PDF
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `invoice-${orderId}.pdf`);

    // Envoyer le fichier au client directement
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);
    
    // Contenu du PDF
    doc.pipe(res);
    doc.fontSize(18).text(`Facture - Commande N° ${order.id}`, { align: 'center' });
    doc.text('\n');
    doc.fontSize(14).text(`Date : ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Total : ${order.total} €`);
    doc.text(`Statut : ${order.status}`);
    doc.text('\nArticles :');

    order.OrderItems.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.Article.name} - ${item.quantity} × ${item.price} €`
      );
    });

    doc.end();
  } catch (error) {
    console.error('Erreur lors de la génération de la facture :', error);
    res.status(500).json({ error: 'Erreur lors de la génération de la facture' });
  }
};
