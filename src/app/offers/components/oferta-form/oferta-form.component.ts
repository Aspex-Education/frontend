import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { OFFERS_REPOSITORY } from '../../services/offers-repository.token';
import { OffersRepository } from '../../services/offers-repository';
import { OfferLaboralInput, OfferLaboral } from '../../models/offer.model';

@Component({
  selector: 'app-oferta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './oferta-form.component.html',
  styleUrls: ['./oferta-form.component.css']
})
export class OfertaFormComponent implements OnInit {
  formTitle = 'Nueva oferta';
  isSaving = false;
  isLoading = false;
  errorMessage = '';
  offerId: string | null = null;

  offerForm = this.fb.group({
    titulo: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    ciudad: ['', [Validators.required]],
    barrio: ['', [Validators.required]],
    telefonoFijo: [''],
    whatsapp: ['', [Validators.required]],
    activa: [true],
    destacada: [false]
  });

  constructor(
    private fb: FormBuilder,
    @Inject(OFFERS_REPOSITORY) private offersRepository: OffersRepository,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.offerId = this.route.snapshot.paramMap.get('id');
    if (this.offerId) {
      this.formTitle = 'Editar oferta';
      this.loadOffer(this.offerId);
    }
  }

  private async loadOffer(id: string): Promise<void> {
    this.isLoading = true;
    const result = await this.offersRepository.getOfferById(id);
    this.isLoading = false;

    if (!result) {
      this.errorMessage = 'No se encontró la oferta para edición.';
      return;
    }

    this.offerForm.patchValue({
      titulo: result.titulo,
      descripcion: result.descripcion,
      pais: result.pais,
      ciudad: result.ciudad,
      barrio: result.barrio,
      telefonoFijo: result.telefonoFijo,
      whatsapp: result.whatsapp,
      activa: result.activa,
      destacada: result.destacada
    });
  }

  async submit(): Promise<void> {
    if (this.offerForm.invalid) {
      this.offerForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const payload: OfferLaboralInput = this.offerForm.value as OfferLaboralInput;
    try {
      if (this.offerId) {
        await this.offersRepository.updateOffer(this.offerId, payload);
      } else {
        await this.offersRepository.createOffer(payload);
      }
      this.router.navigate(['/admin/ofertas']);
    } catch (error) {
      this.errorMessage = 'Ocurrió un error al guardar la oferta. Intenta de nuevo.';
    } finally {
      this.isSaving = false;
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/ofertas']);
  }
}
