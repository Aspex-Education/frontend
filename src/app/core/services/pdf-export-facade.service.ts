import { Injectable } from '@angular/core';
import { ListadoPdfExportService } from './listado-pdf-export.service';
import { OperationItem } from '../models/template.model';


@Injectable({
  providedIn: 'root'
})
export class PdfExportFacadeService {

  constructor(
    private listadoPdfService: ListadoPdfExportService
    // A futuro: 
    // private samPdfService: SamPdfExportService,
    // private fichaTecnicaPdfService: FichaTecnicaPdfService
  ) { }

  /**
   * Exporta un listado de operaciones delegando la responsabilidad
   * al servicio específico ListadoPdfExportService
   */
  exportListadoOperaciones(productName: string, operations: OperationItem[]): void {
    this.listadoPdfService.exportOperationsToPdf(productName, operations);
  }

  // Ejemplo de cómo evolucionaría a un patrón Strategy a futuro:
  /*
  exportFromTemplate(templateType: string, templateData: any): void {
    const strategies: Record<string, () => void> = {
      'LISTADO_OPERACIONES': () => this.listadoPdfService.exportOperationsToPdf(templateData.name, templateData.operations),
      'SAM': () => this.samPdfService.export(templateData),
      // ...
    };

    const strategy = strategies[templateType];
    if (strategy) {
      strategy();
    } else {
      console.warn(`No PDF export strategy found for type: ${templateType}`);
    }
  }
  */
}
