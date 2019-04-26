export class Application {
    AppId: number;
    UserId: number;
    FirstName: string;
    LastName: string;
    StateOrProvince: string;
    Country: string;
    Gender: string;
    Email: string;
    AppDate: Date;
    DOB: Date;
    Approval_Status: string;
    AppConfirmed: string;
    AppConfirmUID: string;
    Username: string;
    MusicServed: string;
    SongsReview: number;
    City: string;
    PromoSongs:number;
    bio: string;
    profile_pic:string;
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    closedate:string;
    
}

export class PackageDetail {
   Id: number;
   UserId: number;
   PkgId : number;
   PkgType : string;
   PkgName : string;
   PkgDetail : string;
   Price : string;
   Songs : number;
   DistributionPct : string;
   DistributionMin : string;

}
export type KVP = {key: string, value:string};
export type KVPG = {id: string, name:string};


export class NavLink {
    constructor (public label: string, public path: string, public isVisible = true , public counts = '') {

    }
}
export class Song {
    SongId: number;
    UserId: number;
    Username: string;
    SongTitle: string;
    ArtistName: string;
    Duration: string;
    Genre: string;
    SubGenre: string;
    Label: string;
    Website: string;
    CD: string;
    Vinyl: string;
    MIDownload: string;
    Status: string;
    tire2status: string;
    Region: string;
    DistDate: Date;
    artist_image: string;
    SongFile: string;
    Filename: string;
    OverallRating: number | null;
    ImageSource: string = null;
    Facebook_link:string;
    Twitter_link:string;
    Spotify_link:string;
    iTunes_link:string;
    albumId: string;
    new_albumId: string = null;
    album_type: string = null;
    album_name: string = null;
    album_gener: string| null;
    NoOfRaters: number | null;
    NoOfDist: number | null;
    wheretobuy: string | null;
    album_image: string | null;
}

export class EditSong {
    SongId: number;
    UserId: number;
    AlbumName: string;
    Copyright_Owner: string;
    Country: string;
    SongTitle: string;
    ArtistName: string;
    Genre: string;
    Label: string;
    Website: string;
    artist_image: string;
    Copy_Year: Date;
    Duration: string;
    SubGenre: string;
    CD: string;
    Vinyl: string;
    MIDownload: string;
    Status: string;
    tire2status: string;
    Region: string;
    DistDate: Date;
    SongFile: string;
    Filename: string;
    OverallRating: number | null;
    wheretobuy:string;
    ImageSource: string = null;
    State:string;
    Facebook_link:string;
    Twitter_link:string;
    Spotify_link:string;
    iTunes_link:string;
}
export class AppWithData  {
 
  file: {
    data: string; 
    filename: string;
  }

}
export class SongFeedback  {
  
  SongId: number;
  Id:number;
  OverallRating: number | null;
  Comment:string;
  
}
export class InduvidualFans{
    UserId:number;
    FirstName:string;
    LastName:string;
}
export class SongFeedbackinfo  {
  
  UserId:number;
  Username:string;
  OverallRating: number | null;
  Comment:string;
  Country:string;
  StateOrProvince:string;
  City:string | null;
  
}
export class AdminUser {
  UserId:number;
  Username:string;
  admin_status:string;
  email:string | null;
}


export class Songcratefriendsinfo  {
  crate_id:number;
  UserId:number;
  Username:string;
  created_date:string;
  status:string | null;
  block_status:string | null;
  
}
export class Userinfo {
    UserId: number;
    Username: string;
    FirstName: string;
    LastName: string;
    country_name: string;
    StateOrProvince: string;
    City: string;
    Gender: string;
    Email: string;
    DOB: Date;
    MusicServed: string;
}


export class Albuminfo {
    album_id: number;
    album_type: string;
    album_name: string;
    album_image: string;
    album_image_path: string;
    userId: number;
    album_status:string;
    
}
export class Siteconfiginfo {
    id: number;
    ep_limit: number;
    album_limit: number;
    ideltime: number;
    defaultreviewlimit: number;
    defaultpackage: number;
    fileuploadsize: number;
    listeningroomconfig: number;
    set_distibution: number;
    paypal_env: string;
    paypal_key: string;
    tire2_per: number;
    tire2_ret: number;
    tire3_per: number;
    tire3_ret: number;
    tire4_per: number;
    tire4_ret: number;
}
export class AdminRights {
    userId: number;
    application: number;
    music: number;
    sitesetting: number;
    users: number;
    auditlog: number;
    logs: number;
    mediadistribution:number;
    packagesetting:number;
}
export class NewSong {

    GenerId: string; 
    GenerName: string;
    DataCount:number; 
    EndLimit:number;
    data: [{
    SongId: number;
    UserId: number;
    Username: string;
    SongTitle: string;
    ArtistName: string;
    Duration: string;
    Genre: string;
    SubGenre: string;
    Label: string;
    Website: string;
    CD: string;
    Vinyl: string;
    MIDownload: string;
    Status: string;
    tire2status: string;
    Region: string;
    DistDate: Date;
    artist_image: string;
    SongFile: string;
    Filename: string;
    OverallRating: number | null;
    ImageSource: string | null;
    Facebook_link:string;
    Twitter_link:string;
    Spotify_link:string;
    iTunes_link:string;
    albumId: string;
    new_albumId: string | null;
    album_type: string | null;
    album_name: string | null;
    album_gener: string| null;
    NoOfRaters: number | null;
    NoOfDist: number | null;
    album_image: string | null;
    }];
    
}
export class songlist{
Event: number;
SongId: number;
artistimage:  string;
inLibrary: true
songdata :{
    SongId: number;
    UserId: number;
    Username: string;
    SongTitle: string;
    ArtistName: string;
    Duration: string;
    Genre: string;
    SubGenre: string;
    Label: string;
    Website: string;
    CD: string;
    Vinyl: string;
    MIDownload: string;
    Status: string;
    tire2status: string;
    Region: string;
    DistDate: Date;
    artist_image: string;
    SongFile: string;
    Filename: string;
    OverallRating: number | null;
    ImageSource: string | null;
    Facebook_link:string;
    Twitter_link:string;
    Spotify_link:string;
    iTunes_link:string;
    albumId: string;
    new_albumId: string | null;
    album_type: string | null;
    album_name: string | null;
    album_gener: string| null;
    NoOfRaters: number | null;
    NoOfDist: number | null;
    wheretobuy: string | null;
    album_image: string | null;
}
}

export class PackageDetails {
   PkgId : number;
   PkgType : string;
   PkgName : string;
   PkgDetail : string;
   Price : string;
   Songs : number;
   DistributionPct : string;
   DistributionMin : string;

}
export class MessageDetails {
   message_id : number;
   from_id : number;
   to_id : number;
   song_id : number;
   send_date : string;
   status : string;
   subject : string;
   message_content : string;
   message_status : string;
   del_sender : string;
   lbb_id : number  | null;
   fromusername : string;
   tousername : string;
   SongTitle : string;
   messagestatus : string;

}
export class Auditlog {
   Id : number;
   Timestamp : string;
   UserId : number;
   Action : string;
   ActionData : string;
   Username : string;
}
export class Log {
   Id : number;
   Timestamp : string;
   UserId : number;
   Username:string;
   Title : string;
   Category:string;
   LogData : string;
}