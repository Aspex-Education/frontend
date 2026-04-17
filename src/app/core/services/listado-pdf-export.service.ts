import { Injectable } from '@angular/core';
import * as pdfMakeLib from 'pdfmake/build/pdfmake';
import * as pdfFontsLib from 'pdfmake/build/vfs_fonts';
import { OperationItem } from '../models/template.model';

const pdfMake: any = (pdfMakeLib as any).default || pdfMakeLib;
const pdfFonts: any = (pdfFontsLib as any).default || pdfFontsLib;
const vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

@Injectable({
  providedIn: 'root'
})
export class ListadoPdfExportService {

  constructor() { }

  exportOperationsToPdf(productName: string, operations: OperationItem[]): void {
    const title = productName.trim() || 'Prenda sin nombre';

    const tableBody = [
      [
        { text: 'N°', bold: true, fillColor: '#f3f4f6' },
        { text: 'Operación', bold: true, fillColor: '#f3f4f6' },
        { text: 'Máquina', bold: true, fillColor: '#f3f4f6' },
        { text: 'Tiempo (s)', bold: true, fillColor: '#f3f4f6', alignment: 'center' }
      ]
    ];

    operations.forEach((op, index) => {
      const machineName = op.machine === 'other' ? (op.machine_other || 'Otra') : op.machine;
      tableBody.push([
        { text: (index + 1).toString(), bold: false, fillColor: '' },
        { text: op.description, bold: false, fillColor: '' },
        { text: machineName, bold: false, fillColor: '' },
        { text: op.time_seconds.toString(), bold: false, fillColor: '', alignment: 'center' as any }
      ]);
    });

    const totalSeconds = operations.reduce((sum, op) => sum + (op.time_seconds || 0), 0);
    const totalMinutes = Math.round((totalSeconds / 60) * 100) / 100;

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      content: [
        { text: 'cONFEX APP', style: 'brand', alignment: 'right' },
        { text: 'Listado de Operaciones', style: 'header' },
        { text: `Prenda: ${title}`, style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto'],
            body: tableBody
          },
          layout: 'lightHorizontalLines'
        },
        {
          text: `Tiempo Total: ${totalSeconds} segundos (${totalMinutes} min)`,
          style: 'total',
          alignment: 'right'
        }
      ],
      styles: {
        brand: {
          fontSize: 10,
          color: '#666666',
          margin: [0, 0, 0, 20]
        },
        header: {
          fontSize: 22,
          bold: true,
          color: '#003f87',
          margin: [0, 0, 0, 5]
        },
        subheader: {
          fontSize: 14,
          margin: [0, 0, 0, 20]
        },
        total: {
          fontSize: 12,
          bold: true,
          margin: [0, 20, 0, 0]
        }
      },
      defaultStyle: {
        font: 'Roboto'
      }
    };

    const fileName = `Listado_Operaciones_${title.replace(/\s+/g, '_')}.pdf`;
    // Pass vfs directly in the 4th argument of createPdf instead of mutating the global library
    pdfMake.createPdf(docDefinition, undefined, undefined, vfs).download(fileName);
  }
}
