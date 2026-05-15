import { Injectable } from '@angular/core';
import { getFirestore, collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, deleteDoc, serverTimestamp, DocumentData, QueryConstraint } from 'firebase/firestore';
import { OffersRepository } from './offers-repository';
import { OfferLaboral, OfferLaboralInput } from '../models/offer.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseOffersRepository implements OffersRepository {
  private readonly db = getFirestore();
  private readonly collectionName = 'ofertas_laborales';

  async getOfferById(id: string): Promise<OfferLaboral | null> {
    if (!id) {
      return null;
    }

    const offerRef = doc(this.db, this.collectionName, id);
    const snapshot = await getDoc(offerRef);
    if (!snapshot.exists()) {
      return null;
    }

    return this.mapDocument(snapshot.id, snapshot.data());
  }

  async listActiveOffersByCity(city: string, excludeId: string, limit: number): Promise<OfferLaboral[]> {
    if (!city) {
      return [];
    }

    const queryConstraints: QueryConstraint[] = [where('ciudad', '==', city), where('activa', '==', true)];
    const offersRef = collection(this.db, this.collectionName);
    const q = query(offersRef, ...queryConstraints);
    const snapshots = await getDocs(q);
    const offers = snapshots.docs
      .map((docSnapshot) => this.mapDocument(docSnapshot.id, docSnapshot.data()))
      .filter((offer) => offer.id !== excludeId);

    return this.shuffle(offers).slice(0, limit);
  }

  async listOffers(): Promise<OfferLaboral[]> {
    const offersRef = collection(this.db, this.collectionName);
    const snapshots = await getDocs(offersRef);
    return snapshots.docs.map((docSnapshot) => this.mapDocument(docSnapshot.id, docSnapshot.data()));
  }

  async createOffer(offer: OfferLaboralInput): Promise<string> {
    const data = {
      ...offer,
      fechaCreacion: serverTimestamp()
    };
    const offersRef = collection(this.db, this.collectionName);
    const newDoc = await addDoc(offersRef, data as DocumentData);
    return newDoc.id;
  }

  async updateOffer(id: string, offer: OfferLaboralInput): Promise<void> {
    const offerRef = doc(this.db, this.collectionName, id);
    await updateDoc(offerRef, { ...offer } as DocumentData);
  }

  async deleteOffer(id: string): Promise<void> {
    const offerRef = doc(this.db, this.collectionName, id);
    await deleteDoc(offerRef);
  }

  async setOfferActive(id: string, active: boolean): Promise<void> {
    const offerRef = doc(this.db, this.collectionName, id);
    await updateDoc(offerRef, { activa: active } as DocumentData);
  }

  private mapDocument(id: string, data: DocumentData): OfferLaboral {
    const raw = data as Record<string, any>;
    return {
      id,
      titulo: raw['titulo'] || '',
      descripcion: raw['descripcion'] || '',
      ciudad: raw['ciudad'] || '',
      telefono: raw['telefono'] || '',
      whatsapp: raw['whatsapp'] || '',
      activa: !!raw['activa'],
      destacada: !!raw['destacada'],
      fechaCreacion: raw['fechaCreacion']
    };
  }

  private shuffle<T>(items: T[]): T[] {
    return items
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((item) => item.value);
  }
}
