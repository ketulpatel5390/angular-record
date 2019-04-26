import { ApplicationRef, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
import { Song, KVP } from '../_models/songbook-life';
import { ObservableProperty } from '../_models/observable-property';

export interface IToken {
  token: string;
  isAuthenticated: boolean;
  is_songbook: boolean;
  errvar: number;
  UserId: number;
  Username: string;
  isAdmin: boolean;
  admin_status :number;
  Approval_Status: string;
  isupload: string;
}

export const enum CacheItemNames {
  AllSongs = 'AllSongs',
  SongsToReview = 'SongsToReview'
}

export class CacheItem<T> {
  constructor(public key: CacheItemNames | string, public item: T, public expirationDate: moment.Moment = null){}
}

export class CacheManager {
  private _cacheMap = new Map<CacheItemNames | string, CacheItem<any>>();

  clear(){
    let self = this;
    self._cacheMap.clear();
  }

  get<T>(key: CacheItemNames | string): T{
    let self = this;
    if (!self._cacheMap.has(key))
      return null;
    
    let item = self._cacheMap.get(key);
    if (item.expirationDate == null || moment().isSameOrBefore(item.expirationDate))
      return item.item;

    self._cacheMap.delete(key);
    return null;
  }

  set<T>(key: CacheItemNames | string, item: T, expirationDate: moment.Moment = null){
    let self = this;
    self._cacheMap.set(key, new CacheItem(key, item, expirationDate));
  }
}

export const enum MusicEventActions {
  Play,
  Pause,
  Stop,
  Skip,
  Queue,
  Dequeue,
  Mute,
  Loop
}

export class MusicEvent {
  constructor (public action: MusicEventActions, public song: Song, 
    public imageSource: string = null, public inLibrary: boolean = false){}
}

@Injectable()
export class SharedDataService {

  constructor() {
    let self = this;
    self.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  public cacheMap = new Map<CacheItemNames, any>();
  public cacheManager = new CacheManager();


  private _onCurrentUserChanged: BehaviorSubject<IToken> = new BehaviorSubject<IToken>(null);
  public readonly onCurrentUserChanged = this._onCurrentUserChanged.asObservable();
  
  get currentUser() {
    let rv = this._onCurrentUserChanged.value || JSON.parse(localStorage.getItem('currentUser'));
    return rv;
  }
  set currentUser(value: IToken){
    let self = this;
    self.cacheManager.clear();

    if (value)
      localStorage.setItem('currentUser', JSON.stringify(value));
    else
      localStorage.removeItem('currentUser');

    self._onCurrentUserChanged.next(value);
  }
  
  private _onMusicEvent: BehaviorSubject<MusicEvent> = new BehaviorSubject<MusicEvent>(null);
  public readonly onMusicEvent = this._onMusicEvent.asObservable();

  emitMusicEvent (event: MusicEvent){
    let self = this;
    console.log(event);
    self.cacheManager.clear();
    self._onMusicEvent.next(event);
    
  }
  clearMusicEvent (){
    let self = this;
    self.cacheManager.clear();
    console.log("clearMusicEvent");
    self._onMusicEvent.next(null);
    
  }

  headerIsVisible = new ObservableProperty<boolean>(true);
  pageTitle = new ObservableProperty<string>();
  
  private _onProgressBarMessageChanged: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public readonly onProgressBarMessageChanged = this._onProgressBarMessageChanged.asObservable();
  
  showProgressBar(message = 'Please wait...'){
    let self = this;
    console.log(`Show progress bar: ${message}`);
    self._onProgressBarMessageChanged.next(message);
  }

  hideProgressBar(){
    let self = this;
    console.log('Hide progress bar');
    self._onProgressBarMessageChanged.next(null);
  }

  get imageName(){
    let self = this;
    let hostname = window.location.hostname;
    let rv = 'logo.jpg';
    if (hostname == 'localhost' || hostname.indexOf('recorddrop.com') >= 0)
      rv = 'RecordDrop_180x60.png';
    else if (hostname.indexOf('songbook.life') >= 0)
      rv = 'songbook_blue_336x123.png';
    //let rv = self.currentUser != null && self.currentUser.is_songbook ? 'songbook_blue_336x123.png' : 'logo.jpg';
    return rv;
  }
  
  genresByCode = new ObservableProperty<Map<string,string>>();
  genresByName = new ObservableProperty<Map<string,string>>();
  genresList = new ObservableProperty<Map<string, KVP[]>>();
  
  tempData: any;
  
  translateGenreCodes(codes: string) {
    let self = this;
    if (!self.genresByCode.value) return null;
    let codesArray = codes.split('|');
    let rv = codesArray.map(c => self.genresByCode.value.get(c))
      .join('|');
    return rv;
  }
}
