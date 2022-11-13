import { Injectable } from '@angular/core';
import Localbase from 'localbase';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {

  public db = new Localbase('db');

  constructor() {
    
  }

  public get getDB() {
    this.db.config.debug = false
    return this.db;
  }

}
