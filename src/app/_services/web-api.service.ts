import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/zip';

import { SharedDataService } from './shared-data.service';
import { EditSong,Song, Application, KVP ,KVPG ,PackageDetail,
  SongFeedback,InduvidualFans,SongFeedbackinfo,AdminUser,Songcratefriendsinfo,Userinfo,
  Albuminfo,Siteconfiginfo,AdminRights,NewSong,PackageDetails,MessageDetails,Auditlog,Log} from '../_models/songbook-life';

import 'file-saver';
import * as FileSaver from "file-saver";
import { QuestionBase } from '../question-base';
import { MultipleChoiceQuestionBase } from '../multiple-choice-question-base';
import { IID3Tag } from 'id3-parser/lib/interface';

import * as _ from 'lodash';
import { Subject} from 'rxjs/Subject';
import { AsyncSubject } from 'rxjs/AsyncSubject';

export class ApiResults<T> {
  status: number;
  data: T;
  error: any;
}

@Injectable()
export class WebApiService {      




  constructor(private http: HttpClient, private sd: SharedDataService ) { }

/*  addSongToCrate(songId: number): Observable<number>{
    let self = this;
    return self.http.post<number>(`/api/songs/crate/${songId}`, null);
  }*/
    addSongToCrate(songId: number,favourite: string): Observable<number>{
    let self = this;
    return self.http.post<number>(`/api/songs/crate/${songId}/${favourite}`, null);
  }
  
  approveApplication(appId: number): Observable<number> {
    let self = this;
    return self.http.put<number>(`/api/admin/approval/${appId}`, null);
  }
  
  changePassword(newPassword: string, oldPassword: string, username: string = null, resetCode: string = null): Observable<number> {
    let self = this;
    let payload = {
      newPassword: newPassword,
      oldPassword: oldPassword,
      username: username,
      resetCode: resetCode
    };
    return self.http.put<number>(`/api/register/password`, payload);
  }
  ckeckoldPassword(oldPassword: string) {
    let self = this;
    return self.http.get(`/api/register/ckeckoldPassword/${oldPassword}`);
    
  }

  distributeSongs(){
    let self = this;
    let userId = self.sd.currentUser.UserId;
    return self.http.get(`/api/songs/distributeSongs/${userId}`);
  }
  
  downloadSong(songId: number, filename: string){
    let self = this;
    self.http.get(`/api/songs/songData/${songId}`,{responseType: 'blob'})
      .subscribe(response => {
        //console.log(response);
        //saveAs(response, filename);
        FileSaver.saveAs(response, filename);
        let url = URL.createObjectURL(response);
        window.open(url);
      });
  }
  
  getApplication(): Observable<Application> {
    let self = this;
    return self.http.get<Application>(`/api/applications/application`);
  }
  getApplicationPackage(): Observable<PackageDetail> {
    let self = this;
    return self.http.get<PackageDetail>(`/api/applications/applicationpackage`);
  }

  
  getApplications(skip: number, take: number, searchby : string = null,sortkey : string = null,sortreverse : string = null): Observable<Application[]> {
    let self = this;
   
    let params = new HttpParams();
    return self.http.get<Application[]>(`/api/admin/applications/${skip}/${take}`, { params : {
      searchby: searchby,
      sortkey: sortkey,
      sortreverse: sortreverse}});
  }
  
  getApplicationsCount(searchby : string = null,sortkey : string = null,sortreverse : string = null): Observable<number> {
    let self = this;
    
    let params = new HttpParams();
    return self.http.get<number>(`/api/admin/applicationsCount`, { params : {searchby: searchby,sortkey: sortkey,
      sortreverse: sortreverse}});
  }

  getArtistImage(filename: string): Observable<string> {
    let self = this;
    return self.http.get<string>(`/api/songs/artistImage/${filename}`);
  }

  getAudioSource(songId: number, full = false): Observable<string> {
    let self = this;
    return self.http.get<string>(`/api/songs/audioSource/${songId}/${full}`);
  }

  getAuditLog(skip: number, take: number): Observable<Auditlog[]> {
    let self = this;
    return self.http.get<Auditlog[]>(`/api/admin/auditLog/${skip}/${take}`);
  }

  getDropdownLists(questions: QuestionBase<any>[]): Observable<KVP[][]> {
    let self = this;
    let rv: Observable<KVP[]>[] = [];
    questions.forEach(q => {
      let mcq = q as MultipleChoiceQuestionBase<any>;
      if (mcq.optionsListId != undefined && mcq.optionsListId.length > 0) {
        let id = mcq.optionsListId;
        let o = self.getProperty<KVP[]>(id);
        rv.push(o);
          o.subscribe(response => {
            mcq.options = response;
        });
      }
    });
  
    return Observable.zip(...rv);
  }
  getEmailConfirmation(): Observable<boolean> {
    let self = this;
    return self.http.get<boolean>(`/api/register/emailConfirmation/${self.sd.currentUser.UserId}`)
  }
  
  getLibrary(skip: number, take: number, sortbygener : string = null,sortkey : string = null,sortreverse : string = null): Observable<Song[]> {
    let self = this;
    let params = new HttpParams();
    return self.http.get<Song[]>(`/api/songs/library/${skip}/${take}`,
      { params : {sortbygener: sortbygener,sortkey: sortkey,sortreverse: sortreverse}});
  }
  getLibraryCount(sortbygener : string = null,sortkey : string = null,sortreverse : string = null): Observable<number> {
    let self = this;
    let params = new HttpParams();
    return self.http.get<number>(`/api/songs/LibraryCount`,
      { params : {sortbygener: sortbygener,sortkey: sortkey,sortreverse: sortreverse}});
  }

  getLog(skip: number, take: number): Observable<Log[]> {
    let self = this;
    return self.http.get<Log[]>(`/api/admin/log/${skip}/${take}`);
  }

  getPortfolio(skip: number, take: number): Observable<Song[]> {
    let self = this;
    return self.http.get<Song[]>(`/api/songs/portfolio/${skip}/${take}`);
  }
  getPortfolioCount(): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/PortfolioCount`);
  }

  getProperty<T>(id: string): Observable<T>{
    let rv: Observable<T>;
    let self = this;
    let cacheId = `P_${id}`;
   /* let cacheValue = <Observable<T>>self.sd.cacheManager.get(cacheId);
    if (cacheValue) {
      //rv = Observable.of(cacheValue);
      rv = cacheValue;
      console.log('Property retrieved from cache ', cacheId);
      return rv;
    }
    else {*/
      if (id == 'GenreGroupNames') {
        let subject = new AsyncSubject<T>();
        rv = subject.asObservable();
        //GroupNames is based on Genres so make sure that is fetched first
        self.getProperty('Genres').subscribe(response => {
          let groupNames = Array.from(self.sd.genresList.value.keys()).map(k=><KVP>{key: k, value: k});
          subject.next(<any>groupNames);
          subject.complete();
        });
      }
      else {
        rv = self.http.get<T>(`/api/register/property/${id}`);
        //self.sd.cacheManager.set(cacheId, rv);  //for now cache the http get
        rv.subscribe(response => {
          //special handling for Genres
          if (id == 'Genres') self.processGenreList(<any>response);        

          //self.sd.cacheManager.set(cacheId, Observable.of(response));  //replace with actual value

        });
      }
   // }
    return rv;
  }

  getPropertys<T>(id: string): Observable<T>{
    let rv: Observable<T>;
    let self = this;
    
      if (id == 'GenreGroupNames') {
        let subject = new AsyncSubject<T>();
        rv = subject.asObservable();
        //GroupNames is based on Genres so make sure that is fetched first
        self.getProperty('Genres').subscribe(response => {
          let groupNames = Array.from(self.sd.genresList.value.keys()).map(k=><KVPG>{id: k, name: k});
          subject.next(<any>groupNames);
          subject.complete();
        });
      }
   
    return rv;
  }
  
  
  private processGenreList(response: KVP[]){
    let self = this;
      //Get groupnames
      let groupNames = _.uniq(response.map(g => <string>g.value.split('_')[1]));
      let genresList = new Map(groupNames.map(g => [g, []] as [string, KVP[]]));
      response.forEach(k => {
        let values = k.value.split('_');
        genresList.get(values[1]).push({key: k.key, value: values[0]});
      });
      self.sd.genresList.value = genresList;

      //console.log('Genres Cached', self.sd.genresList.value);
      self.sd.genresByCode.value = new Map(response.map(g => [g.key, g.value] as [string,string]));
      self.sd.genresByName.value = new Map(response.map(g => [g.value, g.key] as [string,string]));
  }

  getSongs(searchname: string,skip : number, take: number): Observable<Song[]> {
    let self = this;
    if(searchname){

    }else{
      searchname = '';
    }
    let params = new HttpParams().set('searchname',searchname);

    return self.http.get<Song[]>(`/api/songs/songs/${skip}/${take}`,{params: params});

  }
  
  getSongsCount(searchname: string): Observable<number> {
    let self = this;
    if(searchname){

    }else{
      searchname = '';
    }
    let params = new HttpParams().set('searchname',searchname);
    return self.http.get<number>(`/api/songs/songsCount`,{ params: params});
  }
  
  getSongsToReview(skip: number, take: number): Observable<NewSong[]> {
    let self = this;
    return self.http.get<NewSong[]>(`/api/songs/songsToReview/${self.sd.currentUser.UserId}/${skip}/${take}`);
  }
  getSongsToReviewCount(): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/songsToReviewCount/${self.sd.currentUser.UserId}`);
  }

  postFeedback(songId: number, overallRating: number):Observable<number> {
    let self = this;
    return self.http.post<number>('/api/songs/feedback',
      {songId: songId, overallRating: overallRating});
  }
  postFeedbackcomment(songId: number, comment: string):Observable<number> {
    let self = this;
    return self.http.post<number>('/api/songs/postFeedbackcomment',
      {songId: songId, comment: comment});
  }
  
  requestNotification(email: string): Observable<number> {
    let self = this;
    return self.http.post<number>(`/api/register/notificationRequest`, {email: email, message: null});
  }
  
  rejectApplication(appId: number): Observable<number> {
    let self = this;
    return self.http.put<number>(`/api/admin/rejection/${appId}`, null);
  }
  deleteApplication(appId: number): Observable<number> {
    let self = this;
    return self.http.put<number>(`/api/admin/deleteApplication/${appId}`, null);
  }

  resetPassword(username: string): Observable<number>{
    let self = this;
    return self.http.get<number>(`/api/register/passwordReset/${username}`);
  }
  resetPasswords(username: string,email: string): Observable<number>{
    let self = this;
    return self.http.get<number>(`/api/register/passwordResets/${username}/${email}`);
  }

  submitApplication(app: string):Observable<ApiResults<any>> {
    let self = this;
    return self.http.post<ApiResults<any>>('/api/register/application', app, {responseType: 'json'});
  }
  
  updateApplicationStatus(appId: number, status: string): Observable<number> {
    let self = this;
    return self.http.put<number>(`/api/admin/applicationStatus/${appId}/${status}`, null);
  }

  updateSong(songId: number, songData: string):Observable<number> {
    let self = this;
    let payload = JSON.parse(songData);
    return self.http.put<number>(`/api/songs/song/${songId}`, payload);


  }
  updateSongs(songData: string):Observable<HttpEvent<any>> {
   
    let self = this;
    const req = new HttpRequest<any>('POST','/api/songs/updatesongs', songData);
    return self.http.request(req);
  }
  uploadSongWithProgress(songFile: any):Observable<HttpEvent<any>> {
    let self = this;
    const req = new HttpRequest<any>('POST','/api/songs/song', songFile, {reportProgress: true});
    return self.http.request(req);
  }
  
  testSession(): Observable<string> {
    let self = this;
    return self.http.get<string>('/api/register/testSession');
  }

  getApplicationsUserCount(): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/register/applicationsUserCount`);
  }
  getallSongsCount(): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/register/getallSongsCount`);
  }
  getallArtistCount(): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/register/getallArtistCount`);
  }
  submitFacebookApplication(email: string,name: string,id: string) {
    let self = this;
    return self.http.post('/api/register/facebookapplication', {email, name, id},  {responseType: 'text'});
  }
  songuploadsCountByUser(): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/applications/songuploadsCountByUser`);
  }
  songuploadsRemainingCountByUser(): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/applications/songuploadsRemainingCountByUser`);
  }

  deletesongs(songId: number): Observable<string> {
    let self = this;
    return self.http.get<string>(`/api/songs/deletesongs/${songId}`);
  }
  editsongbyuser(songId: number): Observable<EditSong> {
    let self = this;
    return self.http.get<EditSong>(`/api/songs/editsongbyuser/${songId}`);
  }
  updateGeneralinfo(appData: string):Observable<HttpEvent<any>> {
   /* let self = this;
    let payload = JSON.parse(appData);
    return self.http.put<number>(`/api/applications/updateGeneralinfo`, payload);*/
    let self = this;
    const req = new HttpRequest<any>('POST','/api/applications/updateGeneralinfo', appData);
    return self.http.request(req);
  }
  updateGetmusic(appData: string):Observable<number> {
    let self = this;
    let payload = JSON.parse(appData);
    return self.http.put<number>(`/api/applications/updateGetmusic`, payload);
  }
  getfrontSongsCount(searchvalue: string): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/register/frontsongsCount/${searchvalue}`);
  }
  getfrontSongs(skip: number, take: number,searchvalue: string): Observable<Song[]> {
    let self = this;
    return self.http.get<Song[]>(`/api/register/frontsongs/${skip}/${take}/${searchvalue}`);
  }
  
  getfrontallSongsCount(): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/register/frontallsongsCount`);
  }
  getallfrontSongs(skip: number, take: number): Observable<Song[]> {
    let self = this;
    return self.http.get<Song[]>(`/api/register/frontallsongs/${skip}/${take}`);
  }

  getfrontartistImage(filename: string): Observable<string> {
    let self = this;
    return self.http.get<string>(`/api/register/frontartistImage/${filename}`);
  }
  addSongToListeningRoom(songId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/addSongToListeningRoom/${songId}`);
  }
   getSongFeedback(songId: string): Observable<SongFeedback> {
    let self = this;
    return self.http.get<SongFeedback>(`/api/songs/getSongFeedback/${songId}`);
  }
  postMessage(songId: string, subject: string, messsage: string):Observable<number> {
    let self = this;
    return self.http.post<number>('/api/songs/postMessage',
      { songId: songId, subject: subject, messsage: messsage });
  }
  getpromember(): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/register/getpromember`);
  }
  checksession(): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/register/checksession`);
  }
  getFavouriteMember(): Observable<KVPG[]> {
    let self = this;
    return self.http.get<KVPG[]>(`/api/songs/getFavouriteMember`);
  }
  getFavouriteMemberStateOrProvinance(): Observable<KVPG[]> {
    let self = this;
    return self.http.get<KVPG[]>(`/api/songs/getFavouriteMemberStateOrProvinance`);
  }
  
  submitdistribution(distdetail: string):Observable<number> {
    let self = this;
    return self.http.post<number>('/api/songs/submitdistribution', distdetail, {responseType: 'json'});
  }

  getSongApprove(filterby: string,skip: number, take: number): Observable<Song[]> {
    let self = this;
    return self.http.get<Song[]>(`/api/admin/SongApprove/${filterby}/${skip}/${take}`);
  }
  getSongApproveCount(filterby: string): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/admin/SongApproveCount/${filterby}`);
  }
  getApprovesong(songId: number,UserId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/admin/getApprovesong/${songId}/${UserId}`);
  }
  getRejectsong(songId: number,UserId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/admin/getRejectsong/${songId}/${UserId}`);
  }
  songreviewedcount(songId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/songreviewedcount/${songId}`);
  }
  songcrateaddedcount(songId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/songcrateaddedcount/${songId}`);
  }
  songcrateaddedcountinuser(songId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/songcrateaddedcountinuser/${songId}`);
  }
  
  songfavouriteaddedcount(songId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/songfavouriteaddedcount/${songId}`);
  }

  getSongFeedbackinfo(songId: number): Observable<SongFeedbackinfo[]> {
    //,skip: number, take: number
    let self = this;
    //return self.http.get<SongFeedbackinfo[]>(`/api/songs/SongFeedbackinfo/${songId}/${skip}/${take}`);
    return self.http.get<SongFeedbackinfo[]>(`/api/songs/SongFeedbackinfo/${songId}`);
  }
  SongFeedbackinfocount(songId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/SongFeedbackinfocount/${songId}`);
  }
  SongpostMessage(songId: string,Rec_UserId : string,subject: string, messsage: string):Observable<number> {
    let self = this;
    return self.http.post<number>('/api/songs/SongpostMessage',
      { songId: songId, Rec_UserId: Rec_UserId, subject: subject, messsage: messsage });
  }
  SendGeolocationMessage(songId: string,region : string,subject: string, messsage: string):Observable<number> {
    let self = this;
    return self.http.post<number>('/api/songs/SendGeolocationMessage',
      { songId: songId, region: region, subject: subject, messsage: messsage });
  }

  getAdminuser(skip: number, take: number): Observable<AdminUser[]> {
    let self = this;
    return self.http.get<AdminUser[]>(`/api/admin/adminuser/${skip}/${take}`);
  }
  
  getAdminuserCount(): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/admin/adminuserCount`);
  }
  addadminuser(username: string,password : string,adminstatus: string,email: string):Observable<number> {
    let self = this;
    return self.http.post<number>('/api/admin/addadminuser',
      { username: username, password: password, adminstatus: adminstatus, email: email});
  }
  getadmindetails(userId: string): Observable<AdminUser> {
    let self = this;
    return self.http.get<AdminUser>(`/api/admin/getadmindetails/${userId}`);
  }
  editadminuser(userId: string, username: string, adminstatus: string, email: string, password : string,):Observable<number> {
    let self = this;
    return self.http.post<number>('/api/admin/editadminuser',
      { userId: userId, username: username, adminstatus: adminstatus,email: email, password: password});
  }
  deleteadminuser(userId: string): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/admin/deleteadminuser/${userId}`);
  }
 
  sharemycrate(username: string):Observable<number> {
    let self = this;
    return self.http.post<number>('/api/songs/sharemycrate',
      { username: username });
  }
  Songcratefriendsinfo(skip: number, take: number): Observable<Songcratefriendsinfo[]> {
    let self = this;
    return self.http.get<Songcratefriendsinfo[]>(`/api/songs/Songcratefriendsinfo/${skip}/${take}`);
  }
  SongcratefriendsinfoCount(): Observable<number>{
    let self = this;
    return self.http.get<number>(`/api/songs/SongcratefriendsinfoCount`);
  }
  
  PendingSongcratefriendsinfo(skip: number, take: number): Observable<Songcratefriendsinfo[]> {
    let self = this;
    return self.http.get<Songcratefriendsinfo[]>(`/api/songs/PendingSongcratefriendsinfo/${skip}/${take}`);
  }
  PendingSongcratefriendsinfoCount(): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/PendingSongcratefriendsinfoCount`);
  }

  
  getSongcraterequest(skip: number, take: number): Observable<Songcratefriendsinfo[]> {
    let self = this;
    return self.http.get<Songcratefriendsinfo[]>(`/api/songs/getSongcraterequest/${skip}/${take}`);
  }
  
  getSongcraterequestCount(): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/getSongcraterequestCount`);
  }
  actionrequestsongcrate(crateid: string, touserid: string, status: string):Observable<number> {
    let self = this;
    return self.http.post<number>('/api/songs/actionrequestsongcrate',
      { crateid: crateid, userid: touserid, status: status});
  }

  Songcratecurrentuserinfo(userId: string): Observable<Userinfo> {
    let self = this;
    return self.http.get<Userinfo>(`/api/songs/Songcratecurrentuserinfo/${userId}`);
  }

  getcrateuserSongs(userId: string,skip: number, take: number): Observable<Song[]> {
    let self = this;
    return self.http.get<Song[]>(`/api/songs/getcrateuserSongs/${userId}/${skip}/${take}`);
  }
  
  getcrateuserSongsCount(userId: string): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/getcrateuserSongsCount/${userId}`);
  }
  insertalbuminfo(appData: string):Observable<number> {
    let self = this;
    //const req = new HttpRequest<any>('POST','/api/songs/insertalbuminfo', appData);
    //return self.http.request(req);
    return self.http.post<number>(`/api/songs/insertalbuminfo`, appData);
  }
  getalbumdetail(albumId: string): Observable<Albuminfo> {
    let self = this;
    return self.http.get<Albuminfo>(`/api/songs/getalbumdetail/${albumId}`);
  }
  getPortfoliobyalbumid(albumid: number,skip: number, take: number): Observable<Song[]> {
    let self = this;
    return self.http.get<Song[]>(`/api/songs/getPortfoliobyalbumid/${albumid}/${skip}/${take}`);
  }
  getPortfolioCountbyalbumid(albumid: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/getPortfolioCountbyalbumid/${albumid}`);
  }
   albumsonguploadsCountByUser(albumid: number, albumtype : string): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/albumsonguploadsCountByUser/${albumid}/${albumtype}`);
  }

  getAlbumwiseSongApprove(albumid: number, skip: number, take: number): Observable<Song[]> {
    let self = this;
    return self.http.get<Song[]>(`/api/admin/getAlbumwiseSongApprove/${albumid}/${skip}/${take}`);
  }
  getAlbumwiseSongApproveCount(albumid: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/admin/getAlbumwiseSongApproveCount/${albumid}`);
  }

  getAlbumSongs(albumid: number,skip: number, take: number): Observable<Song[]> {
    let self = this;
    return self.http.get<Song[]>(`/api/songs/albumsongs/${albumid}/${skip}/${take}`);
  }
  
  getAlbumSongsCount(albumid: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/albumsongsCount/${albumid}`);
  }
  getalbumSongsToReview(albumid: number,skip: number, take: number): Observable<Song[]> {
    let self = this;
    return self.http.get<Song[]>(`/api/songs/albumSongsToReview/${albumid}/${self.sd.currentUser.UserId}/${skip}/${take}`);
  }
  getalbumSongsToReviewCount(albumid: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/albumSongsToReviewCount/${albumid}/${self.sd.currentUser.UserId}`);
  }

  getAlbumLibrary(albumid: number, skip: number, take: number): Observable<Song[]> {
    let self = this;
    return self.http.get<Song[]>(`/api/songs/AlbumLibrary/${albumid}/${skip}/${take}`);
  }
  getAlbumLibraryCount(albumid: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/AlbumLibraryCount/${albumid}`);
  }
  
  getAlbumImage(albumid: string): Observable<string> {
    let self = this;
    return self.http.get<string>(`/api/songs/albumImage/${albumid}`);
  }
  getSiteconfiginfo(): Observable<Siteconfiginfo> {
    let self = this;
    return self.http.get<Siteconfiginfo>(`/api/admin/Siteconfiginfo`);
  }
  updateSiteconfiginfo(Siteconfiginfo: string):Observable<number> {
    let self = this;
    let payload = JSON.parse(Siteconfiginfo);
    return self.http.put<number>(`/api/admin/updateSiteconfiginfo`, payload);


  }
  getSearchApplications(search: string): Observable<Application[]> {
    let self = this;
    return self.http.get<Application[]>(`/api/admin/Searchapplications/${search}`);
  }
  getinfoSiteconfig(): Observable<Siteconfiginfo> {
    let self = this;
    return self.http.get<Siteconfiginfo>(`/api/register/Siteconfiginfo`);
  }
  adminresetPasswords(username: string,email: string): Observable<number>{
    let self = this;
    return self.http.get<number>(`/api/admin/passwordResets/${username}/${email}`);
  }
  getadminrights(userId: string): Observable<AdminRights> {
    let self = this;
    return self.http.get<AdminRights>(`/api/admin/getadminrights/${userId}`);
  }
  getadminrightsformenu(userId: number): Observable<AdminRights> {
    let self = this;
    return self.http.get<AdminRights>(`/api/admin/getadminrights/${userId}`);
  }
   editadminrights(editadminrights: string): Observable<number> {
    let self = this;
    let payload = JSON.parse(editadminrights);
    return self.http.put<number>(`/api/admin/editadminrights`, payload);
    //return self.http.get<AdminRights>(`/api/admin/getadminrights/${userId}`);
  }
   exportdatatopdf(songid: number){
    let self = this;
   //return self.http.get<number>(`/api/songs/exportdatatopdf/${songid}`);
    //return self.http.get<AdminRights>(`/api/admin/getadminrights/${userId}`);
    self.http.get(`/api/songs/exportdatatopdf/${songid}`,{responseType: 'blob'})
      .subscribe(response => {
        //console.log(response);
        //saveAs(response, filename);
        FileSaver.saveAs(response, songid+'.pdf');
        let url = URL.createObjectURL(response);
        window.open(url);
      });
  }

    deleteregisterApplication(appId: number,userId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/register/deleteregisterApplication/${appId}/${userId}`);
  }
  updateregisterApplication(appId: number,userId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/register/updateregisterApplication/${appId}/${userId}`);
  }
    deletesongswithalbum(songId: number,albumId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/deletesongswithalbum/${songId}/${albumId}`);
  }
    updateUserpackage(packageId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/updateUserpackage/${packageId}`);
  }
    getEmailVerification(confirmid: number,userid: number): Observable<boolean> {
    let self = this;
    return self.http.get<boolean>(`/api/register/getEmailVerification/${confirmid}/${userid}`)
  }
    deletesongcratefriend(crateId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/deletesongcratefriend/${crateId}`);
  }
    getuserinfo(userId: string): Observable<Userinfo> {
    let self = this;
    return self.http.get<Userinfo>(`/api/songs/getuserinfo/${userId}`);
  }
  


  getsongdetails(songId: number): Observable<EditSong> {
    let self = this;
    return self.http.get<EditSong>(`/api/admin/getsongdetails/${songId}`);
  }
  adminsongreviewedcount(songId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/admin/adminsongreviewedcount/${songId}`);
  }
  adminsongaveragecountcount(songId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/admin/adminsongaveragecountcount/${songId}`);
  }
  
  adminsonglisteningroomcount(songId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/admin/adminsonglisteningroomcount/${songId}`);
  }
  
  adminsongcrateaddedcount(songId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/admin/adminsongcrateaddedcount/${songId}`);
  }
  adminsongfavouriteaddedcount(songId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/admin/adminsongfavouriteaddedcount/${songId}`);
  }
  admingetSongFeedbackinfo(songId: number): Observable<SongFeedbackinfo[]> {
    let self = this;
    return self.http.get<SongFeedbackinfo[]>(`/api/admin/admingetSongFeedbackinfo/${songId}`);
  }
   deletesongsbyadmin(songId: number): Observable<string> {
    let self = this;
    return self.http.get<string>(`/api/admin/deletesongsbyadmin/${songId}`);
  }
  songdestributioncount(songId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/songdestributioncount/${songId}`);
  }
tier1(): Observable<any[]> {
    let self = this;
    return self.http.get<any[]>(`/api/register/tier1`);
  }
  tier2(): Observable<any[]> {
    let self = this;
    return self.http.get<any[]>(`/api/register/tier2`);
  }
  tier3(): Observable<any[]> {
    let self = this;
    return self.http.get<any[]>(`/api/register/tier3`);
  }
  tier4(): Observable<any[]> {
    let self = this;
    return self.http.get<any[]>(`/api/register/tier4`);
  }
  finishsongswithalbumid(albumId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/finishsongswithalbumid/${albumId}`);
  }
   deletesongsbyalbum(albumId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/deletesongsbyalbum/${albumId}`);
  }
  getpackagedetail(packageId: number): Observable<PackageDetails> {
    let self = this;
    return self.http.get<PackageDetails>(`/api/songs/getpackagedetail/${packageId}`);
  }
   paypalUserpayment(packageId: number,paymentid: string): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/paypalUserpayment/${packageId}/${paymentid}`);
  }
  registerpaypalUserpayment(packageId: number,paymentid: string,userId: string): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/register/registerpaypalUserpayment/${packageId}/${paymentid}/${userId}`);
  }
  songinuserlisteningroom(songId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/songinuserlisteningroom/${songId}`);
  }
  addmultiplesonginuserlisteningroom(songId: string): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/addmultiplesonginuserlisteningroom/${songId}`);
  }
    songAvgrating(songId: string): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/songs/songAvgrating/${songId}`);
  }
     getGenreGroupNames(): Observable<any[]> {
    let self = this;
    return self.http.get<any[]>(`/api/register/getGenreGroupNames`);
  }
  getPortfolionew(): Observable<Song[]> {
    let self = this;
    return self.http.get<Song[]>(`/api/songs/getPortfolionew`);
  }
  getPortfolioEp(): Observable<Song[]> {
    let self = this;
    return self.http.get<Song[]>(`/api/songs/getPortfolioEp`);
  }
  getPortfolioAlbum(): Observable<Song[]> {
    let self = this;
    return self.http.get<Song[]>(`/api/songs/getPortfolioAlbum`);
  }
  getGenreGroupNamesedit(): Observable<any[]> {
    let self = this;
    return self.http.get<any[]>(`/api/songs/getGenreGroupNamesedit`);
  }
   getdeleteSongcraterequest(crate_id : string): Observable<any> {
    let self = this;
    return self.http.get<any>(`/api/songs/getdeleteSongcraterequest/${crate_id}`);
  }
    getUswersGenreGroupNames(): Observable<any[]> {
    let self = this;
    return self.http.get<any[]>(`/api/songs/getUswersGenreGroupNames`);
  }
  getGenreGroupNamesbrowse(): Observable<any[]> {
    let self = this;
    return self.http.get<any[]>(`/api/songs/getGenreGroupNamesbrowse`);
  }
  getSubGenreByid(generid : string): Observable<any[]> {
    let self = this;
    return self.http.get<any[]>(`/api/songs/getSubGenreByid/${generid}`);
  }
  getsongalbumdetail(albumId: string): Observable<Albuminfo> {
    let self = this;
    return self.http.get<Albuminfo>(`/api/songs/getsongalbumdetail/${albumId}`);
  }
  getmessagedetails(): Observable<MessageDetails[]> {
    let self = this;
    return self.http.get<MessageDetails[]>(`/api/songs/getmessagedetails`);
  }
  messagelistbyid(songid: string): Observable<MessageDetails[]> {
    let self = this;
    return self.http.get<MessageDetails[]>(`/api/songs/messagelistbyid/${songid}`);
  }
  getsongmessagedetails(songid: string): Observable<MessageDetails> {
    let self = this;
    return self.http.get<MessageDetails>(`/api/songs/getsongmessagedetails/${songid}`);
  }
  getregpackagedetail(packageId: number): Observable<PackageDetails> {
    let self = this;
    return self.http.get<PackageDetails>(`/api/register/getregpackagedetail/${packageId}`);
  }
  
  packageregisterApplication(packageid: number,appId: number,userId: number): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/register/packageregisterApplication/${packageid}/${appId}/${userId}`);
  }
  varificationemail(): Observable<any> {
    let self = this;
    return self.http.get<any>(`/api/songs/varificationemail`);
  }
  inserterrorreport(appData: string):Observable<number> {
    let self = this;
    return self.http.post<number>(`/api/songs/inserterrorreport`, appData);
  }
  getGenreNamewheneditsong(songid: number): Observable<any> {
    let self = this;
    return self.http.get<any>(`/api/songs/getGenreNamewheneditsong/${songid}`);
  }
  admingetpackagedetails(): Observable<PackageDetails[]> {
    let self = this;
    return self.http.get<PackageDetails[]>(`/api/admin/admingetpackagedetails`);
  }
  getadminpackagedetail(packageId: string): Observable<PackageDetails> {
    let self = this;
    return self.http.get<PackageDetails>(`/api/admin/getadminpackagedetail/${packageId}`);
  }
  editpackageinfo(packageData: string):Observable<number>{
    let self = this;
    return self.http.post<number>(`/api/admin/editpackageinfo`, packageData);
  }
  getlargestpackageid():Observable<number>{
    let self = this;
    return self.http.get<number>(`/api/songs/getlargestpackageid`);
  }
  adminverificationemail(UserId: string): Observable<any> {
    let self = this;
    return self.http.get<any>(`/api/admin/adminverificationemail/${UserId}`);
  }
  userverificationemail(UserId: string): Observable<any> {
    let self = this;
    return self.http.get<any>(`/api/register/userverificationemail/${UserId}`);
  }
  getAuditlogCount(): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/admin/getAuditlogCount`);
  }
  getlogCount(): Observable<number> {
    let self = this;
    return self.http.get<number>(`/api/admin/getlogCount`);
  }
  getUswersGenreGroupNamesbyuser(currentuserid): Observable<any[]> {
    let self = this;
    return self.http.get<any[]>(`/api/songs/getUswersGenreGroupNamesbyuser/${currentuserid}`);
  }

}
